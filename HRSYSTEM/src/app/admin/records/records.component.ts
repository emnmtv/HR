import { Component, OnInit } from '@angular/core';
import { EmployeeRecordService } from './employee-record.service.service';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  cellphone_number: string;
  sex: string;
  place_of_birth: string;
  city: string;
  barangay: string;
  province: string;
  vaccination_status: boolean;
  company: string;
}

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private employeeRecordService: EmployeeRecordService) {}

  ngOnInit(): void {
    this.getEmployeeRecords();
  }

  // Fetch employee data from the backend
  getEmployeeRecords(): void {
    this.employeeRecordService.getEmployeeData().subscribe({
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
        this.errorMessage = 'An error occurred while fetching employee records.';
        this.loading = false;
      }
    });
  }

  // Show selected employee details
  showDetails(employee: Employee): void {
    this.selectedEmployee = employee;
  }
}
