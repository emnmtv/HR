import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  employees: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  // Method to get employee data
  getEmployees(): void {
    this.employeeService.getEmployeeData().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.employees = response.data;
        } else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching employee data', err);
        this.errorMessage = 'An error occurred while fetching employee data.';
        this.loading = false;
      }
    });
  }
}
