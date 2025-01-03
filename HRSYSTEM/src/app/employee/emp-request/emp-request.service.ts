import { Component, OnInit } from '@angular/core';
import { RequestService } from './request.service';

@Component({
  selector: 'app-emp-request',
  templateUrl: './emp-request.component.html',
  styleUrls: ['./emp-request.component.scss']
})
export class EmpRequestComponent implements OnInit {
  requests: any[] = [];
  showModal = false;

  // Data for the new request form
  newRequest = {
    type: '',
    date: '',
    reason: ''
  };

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.fetchPendingRequests();
  }

  // Fetch pending requests
  fetchPendingRequests() {
    const employeeId = 456; // Replace with actual employee ID
    this.requestService.getPendingRequests(employeeId).subscribe(
      (response) => {
        this.requests = response;
      },
      (error) => {
        console.error('Error fetching pending requests:', error);
      }
    );
  }

  // Open the modal
  openRequestModal() {
    this.showModal = true;
  }

  // Close the modal
  closeRequestModal() {
    this.showModal = false;
  }

  // Submit the new request
  submitRequest() {
    if (this.newRequest.type && this.newRequest.date && this.newRequest.reason) {
      const requestPayload = {
        employee_id: 456, // Replace with actual employee ID
        date: this.newRequest.date,
        type: this.newRequest.type,
        reason: this.newRequest.reason
      };

      this.requestService.createRequest(requestPayload).subscribe(
        (response) => {
          alert(response.message);
          this.fetchPendingRequests();
          this.newRequest = { type: '', date: '', reason: '' };
          this.closeRequestModal();
        },
        (error) => {
          console.error('Error creating request:', error);
        }
      );
    }
  }
}
