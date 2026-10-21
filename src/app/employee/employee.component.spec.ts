import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeComponent } from './employee.component';
import { provideRouter, Router } from '@angular/router';
import { EmployeeService } from '../service/employee.service';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let service: jasmine.SpyObj<EmployeeService>;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    service = jasmine.createSpyObj('EmployeeService', ['addEmployee']);
    service.addEmployee.and.resolveTo();
    TestBed.configureTestingModule({
      imports: [EmployeeComponent],
      providers: [provideRouter([]), { provide: EmployeeService, useValue: service }]
    });
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function fillForm(): void {
    component.employeeForm.setValue({ name: 'Alex Martin', dateOfBirth: '1995-06-15',
      city: 'Ottawa', salary: 54000, gender: 'X', email: 'alex@example.com' });
  }

  it('does not save an incomplete form', async () => {
    await component.onSubmit();
    expect(service.addEmployee).not.toHaveBeenCalled();
  });

  it('rejects blank names, invalid gender, invalid email and negative salaries', () => {
    fillForm();
    component.name.setValue('   ');
    expect(component.employeeForm.invalid).toBeTrue();
    fillForm();
    component.gender.setValue('invalid');
    expect(component.employeeForm.invalid).toBeTrue();
    fillForm();
    component.email.setValue('invalid');
    expect(component.employeeForm.invalid).toBeTrue();
    fillForm();
    component.salary.setValue(-1);
    expect(component.employeeForm.invalid).toBeTrue();
  });

  it('allows empty optional fields and zero salary', () => {
    fillForm();
    component.employeeForm.patchValue({ gender: '', email: '', salary: 0 });
    expect(component.employeeForm.valid).toBeTrue();
  });

  it('saves all six fields and preserves the selected birthday', async () => {
    fillForm();
    await component.onSubmit();
    const saved = service.addEmployee.calls.mostRecent().args[0];
    expect(saved.name).toBe('Alex Martin');
    expect(saved.dateOfBirth.getDate()).toBe(15);
    expect(saved.dateOfBirth.getMonth()).toBe(5);
    expect(saved.city).toBe('Ottawa');
    expect(saved.salary).toBe(54000);
    expect(saved.gender).toBe('X');
    expect(saved.email).toBe('alex@example.com');
    expect(navigate).toHaveBeenCalledWith(['/employees']);
    expect(component.name.value).toBe('');
  });

  it('keeps the form and stays on the page when Firebase rejects a save', async () => {
    fillForm();
    service.addEmployee.and.rejectWith({ code: 'permission-denied' });
    await component.onSubmit();
    fixture.detectChanges();
    expect(component.name.value).toBe('Alex Martin');
    expect(navigate).not.toHaveBeenCalled();
    expect(component.saving).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('security rules');
  });

  it('waits for cloud confirmation and prevents a duplicate submission', async () => {
    fillForm();
    let complete!: () => void;
    service.addEmployee.and.returnValue(new Promise<void>(resolve => complete = resolve));
    const pending = component.onSubmit();
    await component.onSubmit();
    expect(service.addEmployee).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
    expect(component.saving).toBeTrue();
    complete();
    await pending;
    expect(navigate).toHaveBeenCalled();
  });
});
