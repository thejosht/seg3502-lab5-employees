import { Employee } from './employee';
import { employeeFromDocument, employeeToDocument } from './employee-document';

describe('Employee Firestore document', () => {
  it('stores six plain fields and a date without a time zone', () => {
    const document = employeeToDocument(new Employee(' Alex ', new Date(1995, 5, 15), ' Ottawa ', 54000, 'X', ' alex@example.com '));
    expect(document).toEqual({ name: 'Alex', dateOfBirth: '1995-06-15', city: 'Ottawa',
      salary: 54000, gender: 'X', email: 'alex@example.com' });
  });

  it('stores omitted optional fields as empty strings rather than undefined', () => {
    const document = employeeToDocument(new Employee('Alex', new Date(1995, 5, 15), 'Ottawa', 0));
    expect(document.gender).toBe('');
    expect(document.email).toBe('');
  });

  it('round trips birthdays without shifting the calendar day', () => {
    for (const date of [new Date(1995, 0, 1), new Date(2000, 1, 29), new Date(2001, 11, 31)]) {
      const saved = employeeFromDocument(employeeToDocument(new Employee('Alex', date, 'Ottawa', 0)));
      expect(saved.dateOfBirth.getFullYear()).toBe(date.getFullYear());
      expect(saved.dateOfBirth.getMonth()).toBe(date.getMonth());
      expect(saved.dateOfBirth.getDate()).toBe(date.getDate());
    }
  });
});
