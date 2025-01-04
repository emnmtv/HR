import { Component, OnInit } from '@angular/core';
import { EmpRequestService } from './emp-request.service'; 
import { Router } from '@angular/router';

interface EmployeeRequest {
  date: string;
  type: string;
  status: string;
  reason: string;
}

@Component({
  selector: 'app-emp-request',
  templateUrl: './emp-request.component.html',
  styleUrls: ['./emp-request.component.scss']
})
export class EmpRequestComponent implements OnInit {
  summary = {
    leaveRequests: '0 days',
    specialHolidays: '0 days',
    pendingRequests: '0',
    approvedRequests: '0'
  };

  requestRecords: EmployeeRequest[] = [];

  loggedInEmployeeId: number = 0; // Variable to store logged-in employee ID

  isModalOpen = false;  // Boolean to control modal visibility

  newRequest = {
    type: 'Leave',  // Default value is 'Leave'
    reason: ''
  };

  constructor(
    private empRequestService: EmpRequestService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedEmployeeId = localStorage.getItem('employee_id');
    if (storedEmployeeId) {
      this.loggedInEmployeeId = parseInt(storedEmployeeId, 10);
      this.fetchRequestData(this.loggedInEmployeeId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchRequestData(employeeId: number): void {
    this.empRequestService.getEmployeeRequests(employeeId).subscribe(
      response => {
        if (response.status === 'success') {
          this.requestRecords = response.data;
          this.updateSummary(response.data);
        } else {
          alert('Error fetching requests: ' + response.message);
        }
      },
      error => {
        console.error('Error fetching employee requests:', error);
      }
    );
  }

  updateSummary(requests: EmployeeRequest[]): void {
    this.summary.leaveRequests = requests.filter(request => request.type === 'Leave').length + ' days';
    this.summary.specialHolidays = requests.filter(request => request.type === 'Special Holiday').length + ' days';
    this.summary.pendingRequests = requests.filter(request => request.status === 'Pending').length.toString();
    this.summary.approvedRequests = requests.filter(request => request.status === 'Approved').length.toString();
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    const { type, reason } = this.newRequest;
    const employeeId = this.loggedInEmployeeId;
    const date = new Date().toISOString().split('T')[0]; // Current date

    this.empRequestService.createRequest(employeeId, date, type, reason).subscribe(
      (response) => {
        if (response.status === 'success') {
          alert('Request submitted successfully!');
          this.closeModal();  // Close the modal after submission
          this.fetchRequestData(employeeId); // Refresh the requests
        } else {
          alert('Error submitting request: ' + response.message);
        }
      },
      (error) => {
        console.error('Error creating request:', error);
        alert('An error occurred while submitting your request.');
      }
    );
  }
}
