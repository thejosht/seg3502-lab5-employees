export class Employee {
  constructor(
    public name: string,
    public dateOfBirth: Date,
    public city: string,
    public salary: number,
    public gender?: string,
    public email?: string
  ) {}
}
