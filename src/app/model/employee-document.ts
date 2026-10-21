import { Employee } from './employee';

export interface EmployeeDocument {
  name: string;
  dateOfBirth: string;
  city: string;
  salary: number;
  gender: string;
  email: string;
}

// A birthday is a calendar date, not a moment in a particular time zone.
export function employeeToDocument(employee: Employee): EmployeeDocument {
  const date = employee.dateOfBirth;
  return {
    name: employee.name.trim(),
    dateOfBirth: [String(date.getFullYear()).padStart(4, '0'), String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')].join('-'),
    city: employee.city.trim(),
    salary: employee.salary,
    gender: employee.gender || '',
    email: employee.email?.trim() || ''
  };
}

export function employeeFromDocument(document: EmployeeDocument): Employee {
  return new Employee(document.name, new Date(`${document.dateOfBirth}T00:00:00`),
    document.city, document.salary, document.gender, document.email);
}
