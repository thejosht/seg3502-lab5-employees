import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { Employee } from '../model/employee';
import { firstValueFrom } from 'rxjs';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reports missing Firebase settings instead of pretending to save locally', async () => {
    await expectAsync(service.addEmployee(new Employee('Alex', new Date(1995, 5, 15), 'Ottawa', 0)))
      .toBeRejectedWithError(/Firebase is not configured/);
  });

  it('reports missing settings when reading the database', async () => {
    await expectAsync(firstValueFrom(service.getEmployees())).toBeRejectedWithError(/Firebase is not configured/);
  });
});
