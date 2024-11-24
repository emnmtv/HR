import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private employees: any[] = [];

  constructor() {
    this.loadEmployees();
  }

  getEmployees() {
    return this.employees;
  }

  addEmployee(employee: any) {
    const newId = this.employees.length > 0 ? Math.max(...this.employees.map((e) => e.id)) + 1 : 1;
    const employeesWithId = { ...this.employees, id: newId };
    this.employees.push(employeesWithId);
    this.saveEmployees();
  }

  private saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  private loadEmployees() {
    const savedEmployees = localStorage.getItem('employees');
    this.employees = savedEmployees ? JSON.parse(savedEmployees) : [];
  }
}
