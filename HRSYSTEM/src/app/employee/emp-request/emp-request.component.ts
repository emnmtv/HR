import { Component, OnInit } from '@angular/core';
import { EmpRequestService } from './emp-request.service';

@Component({
  selector: 'app-emp-request',
  templateUrl: './emp-request.component.html',
  styleUrls: ['./emp-request.component.scss'],
})
export class EmpRequestComponent implements OnInit {
  requests: any[] = []; // Store API data
  showModal = false;

  newRequest = {
    type: '',
    date: '',
    reason: '',
  };

  employeeId = 456; // Example employee ID (dynamic in a real app)

  constructor(private empRequestService: EmpRequestService) {}

  ngOnInit(): void {
    this.fetchPendingRequests();
  }

  // Fetch pending requests from the API
  fetchPendingRequests(): void {
    this.empRequestService.getPendingRequests(this.employeeId).subscribe({
      next: (data) => {
        this.requests = data;
      },
      error: (error) => {
        console.error('Error fetching pending requests:', error);
      },
    });
  }

  // Submit a new request
  submitRequest(): void {
    if (this.newRequest.type && this.newRequest.date && this.newRequest.reason) {
      const requestData = {
        employee_id: this.employeeId,
        ...this.newRequest,
      };

      this.empRequestService.createRequest(requestData).subscribe({
        next: (response) => {
          console.log('Request created:', response);
          this.fetchPendingRequests(); // Refresh the list
          this.closeRequestModal();
        },
        error: (error) => {
          console.error('Error submitting request:', error);
        },
      });
    }
  }

  openRequestModal(): void {
    this.showModal = true;
  }

  closeRequestModal(): void {
    this.showModal = false;
    this.newRequest = { type: '', date: '', reason: '' };
  }
}
