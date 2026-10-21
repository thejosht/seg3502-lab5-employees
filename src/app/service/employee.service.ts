import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable, defer, from, map, switchMap } from 'rxjs';
import { Employee } from '../model/employee';
import { EmployeeDocument, employeeFromDocument, employeeToDocument } from '../model/employee-document';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly auth = inject(Auth, { optional: true });
  private readonly injector = inject(EnvironmentInjector);
  private signingIn?: Promise<unknown>;

  private async connect(): Promise<void> {
    if (!this.firestore || !this.auth) {
      throw new Error('Firebase is not configured. Add your project settings in src/environments/environment.ts.');
    }
    await this.auth.authStateReady();
    if (!this.auth.currentUser) {
      this.signingIn ??= runInInjectionContext(this.injector, () => signInAnonymously(this.auth!))
        .finally(() => this.signingIn = undefined);
      await this.signingIn;
    }
  }

  getEmployees(): Observable<readonly Employee[]> {
    return defer(() => from(this.connect())).pipe(
      switchMap(() => runInInjectionContext(this.injector, () =>
        collectionData(collection(this.firestore!, 'employees')))),
      map(documents => documents.map(document => employeeFromDocument(document as EmployeeDocument))
        .sort((first, second) => first.name.localeCompare(second.name)))
    );
  }

  async addEmployee(employee: Employee): Promise<void> {
    await this.connect();
    await runInInjectionContext(this.injector, () =>
      addDoc(collection(this.firestore!, 'employees'), employeeToDocument(employee)));
  }
}
