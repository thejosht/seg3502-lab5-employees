import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesComponent } from './employees.component';
import { provideRouter } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../model/employee';
import { Subject, of, throwError } from 'rxjs';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let service: jasmine.SpyObj<EmployeeService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
    service.getEmployees.and.returnValue(of([]));
    TestBed.configureTestingModule({
      imports: [EmployeesComponent],
      providers: [provideRouter([]), { provide: EmployeeService, useValue: service }]
    });
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reads saved employees when the list opens', () => {
    expect(service.getEmployees).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('No employees saved yet');
  });

  it('renders all six fields from the database', () => {
    service.getEmployees.and.returnValue(of([
      new Employee('Alex Martin', new Date(1995, 5, 15), 'Ottawa', 54000, 'X', 'alex@example.com')
    ]));
    component.retry();
    fixture.detectChanges();
    const cells = [...fixture.nativeElement.querySelectorAll('tbody td')].map((cell: any) => cell.textContent.trim());
    expect(cells).toEqual(['Alex Martin', '15/06/1995', 'Ottawa', '54,000.00', 'X', 'alex@example.com']);
  });

  it('shows errors and can retry the cloud read', () => {
    service.getEmployees.and.returnValue(throwError(() => ({ code: 'permission-denied' })));
    component.retry();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('security rules');
    service.getEmployees.and.returnValue(of([]));
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No employees saved yet');
  });

  it('shows loading and releases the subscription when the page closes', () => {
    const records = new Subject<readonly Employee[]>();
    service.getEmployees.and.returnValue(records);
    component.retry();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading employees');
    expect(records.observed).toBeTrue();
    fixture.destroy();
    expect(records.observed).toBeFalse();
  });
});
