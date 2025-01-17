import { Component, OnInit } from '@angular/core';
import { EmpRequestService } from './emp-request.service'; 
import { Router } from '@angular/router';

interface EmployeeRequest {
  date: string;
  type: string;
  status: string;
  reason: string;
}

interface Message {
  message: string;
  created_at: string;
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

  loggedInEmployeeId: number = 0;
  messages: Message[] = [];
  isMessagesModalOpen = false;
  isModalOpen = false;  
  isDetailModalOpen = false;
  selectedRequest: EmployeeRequest | null = null;
  isRequestSubmitted = false;

  newRequest = {
    type: 'Leave',
    reason: '',
    image: '' // Add an image field for base64 data
  };

  constructor(
    private empRequestService: EmpRequestService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.convertFileToBase64(file);
    }
  }
  
  convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.newRequest.image = reader.result as string;  // This stores the base64 string
      console.log('Base64 Image:', this.newRequest.image);  // Check the console to see if it's correct
    };
    reader.readAsDataURL(file);
  }
  

  getStatusClass(status: string): string {
    return {
      Approved: 'status-approved',
      Rejected: 'status-rejected',
      Pending: 'status-pending'
    }[status] || 'status-default';
  }

  fetchMessages(): void {
    const employeeId = this.loggedInEmployeeId;
    this.empRequestService.getMessages(employeeId).subscribe(
      response => {
        if (response.status === 'success') {
          this.messages = response.data.map((message: any) => {
            return {
              message: message.message,
              created_at: new Date(message.created_at)
            };
          });
          this.isMessagesModalOpen = true;
        } else {
          alert('Error fetching messages: ' + (response.message || 'Unknown error'));
        }
      },
      error => {
        console.error('Error fetching messages:', error);
        alert('There was an issue fetching messages. Please try again.');
      }
    );
  }

  closeMessagesModal(): void {
    this.isMessagesModalOpen = false;
    this.messages = [];
  }

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
    const { type, reason, image } = this.newRequest;
    const employeeId = this.loggedInEmployeeId;
    const date = new Date().toISOString().split('T')[0];
  
    this.empRequestService.createRequest(employeeId, date, type, reason, image).subscribe(
      (response) => {
        console.log(response);  // Log the response to check for errors
        if (response.status === 'success') {
          this.isRequestSubmitted = true;
          this.closeModal();
          this.fetchRequestData(employeeId);
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
  

  closeConfirmationPopup(): void {
    this.isRequestSubmitted = false;
  }

  openDetailModal(request: EmployeeRequest): void {
    this.selectedRequest = request;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedRequest = null;
  }
}
