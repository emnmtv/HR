import { Component } from '@angular/core';

@Component({
  selector: 'app-emp-request',
  templateUrl: './emp-request.component.html',
  styleUrls: ['./emp-request.component.scss']
})
export class EmpRequestComponent {
  // Data for the pending requests
  requests = [
    { date: '2025-01-01', type: 'Leave', status: 'Pending' },
    { date: '2025-01-05', type: 'Overtime', status: 'Pending' }
  ];

  // Modal state
  showModal = false;

  // Data for the new request form
  newRequest = {
    type: '',
    date: '',
    reason: ''
  };

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
      // Add the new request to the list
      this.requests.push({
        ...this.newRequest,
        status: 'Pending'
      });

      // Reset the form and close the modal
      this.newRequest = { type: '', date: '', reason: '' };
      this.closeRequestModal();
    }
  }
}
