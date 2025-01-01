import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-salary',
  templateUrl: './admin-salary.component.html',
  styleUrls: ['./admin-salary.component.scss'],
})
export class AdminSalaryComponent {
  salaries = [
    {
      employeeId: 'E123',
      month: 'November 2024',
      gross: 50000,
      deductions: 5000,
      net: 45000,
      status: 'Paid',
    },
    {
      employeeId: 'E124',
      month: 'October 2024',
      gross: 55000,
      deductions: 6000,
      net: 49000,
      status: 'Unpaid',
    },
  ];

  addSalary() {
    this.salaries.push({
      employeeId: '',
      month: '',
      gross: 0,
      deductions: 0,
      net: 0,
      status: 'Unpaid',
    });
  }

  updateSalary(salary: any) {
    salary.net = salary.gross - salary.deductions;
    alert(`Salary for Employee ${salary.employeeId} updated successfully!`);
  }

  deleteSalary(salary: any) {
    const index = this.salaries.indexOf(salary);
    if (index > -1) {
      this.salaries.splice(index, 1);
      alert(`Salary for Employee ${salary.employeeId} deleted!`);
    }
  }
}
