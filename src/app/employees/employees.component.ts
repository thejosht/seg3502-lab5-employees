import { Component, inject } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { Employee } from '../model/employee';
import { firebaseErrorMessage } from '../service/firebase-error';

interface EmployeeListState {
  employees: readonly Employee[];
  loading: boolean;
  error: string;
}

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css'],
    standalone: true,
    imports: [RouterLink, AsyncPipe, DatePipe, DecimalPipe]
})
export class EmployeesComponent {
  private readonly service = inject(EmployeeService);
  private readonly refresh = new Subject<void>();
  readonly state$ = this.refresh.pipe(
    startWith(undefined),
    switchMap(() => this.service.getEmployees().pipe(
      map(employees => ({ employees, loading: false, error: '' } as EmployeeListState)),
      startWith({ employees: [], loading: true, error: '' } as EmployeeListState),
      catchError(error => of({ employees: [], loading: false,
        error: firebaseErrorMessage(error, 'load') } as EmployeeListState))
    ))
  );

  retry(): void {
    this.refresh.next();
  }
}
