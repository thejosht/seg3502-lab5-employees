import {Component, inject} from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import {EmployeeService} from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import {Employee} from "../model/employee";
import { firebaseErrorMessage } from '../service/firebase-error';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule]
})
export class EmployeeComponent {
  private builder: FormBuilder = inject(FormBuilder);
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  saving = false;
  error = '';
  employeeForm = this.builder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    dateOfBirth: ['', Validators.required],
    city: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    salary: [0, [Validators.required, Validators.min(0)]],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', [Validators.email, Validators.maxLength(320)]]
  });

  get name(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('name'); }
  get dateOfBirth(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
  get city(): AbstractControl<string> {return <AbstractControl>this.employeeForm.get('city'); }
  get salary(): AbstractControl<number> {return <AbstractControl<number>>this.employeeForm.get('salary'); }
  get gender(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('gender'); }
  get email(): AbstractControl<string> {return <AbstractControl<string>>this.employeeForm.get('email'); }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.invalid || this.saving) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const employee: Employee = new Employee(this.name.value,
      new Date(`${this.dateOfBirth.value}T00:00:00`),
      this.city.value,
      this.salary.value,
      this.gender.value,
      this.email.value);
    try {
      await this.employeeService.addEmployee(employee);
      this.employeeForm.reset();
      await this.router.navigate(['/employees']);
    } catch (error) {
      this.error = firebaseErrorMessage(error, 'save');
    } finally {
      this.saving = false;
    }
  }
}
