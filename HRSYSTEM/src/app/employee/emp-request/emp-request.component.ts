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
  isUploadModalOpen = false;
 
  medicalDocumentBase64: string = ''; // To store the base64 string of the document
  medicalDocuments: any[] = []; // To store fetched medical documents
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
  convertFileToBase642(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.medicalDocumentBase64 = reader.result as string;
      console.log('Base64 Document:', this.medicalDocumentBase64);
    };
    reader.readAsDataURL(file);
  }
  // Handle file selection and convert it to base64
  onFileSelected2(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.convertFileToBase642(file);
    }
  } // Fetch medical documents for the logged-in employee, including status
  fetchMedicalDocuments(): void {
    this.empRequestService.fetchEmployeeMedical(this.loggedInEmployeeId).subscribe(
      response => {
        if (response.status === 'success') {
          // Prepend the correct base URL for each medical document's path
          this.medicalDocuments = response.data.map((document: any) => {
            document.document_path = document.document_path 
              ? `http://localhost/integapi/main/${document.document_path}` 
              : '';  // Handle the case where the document path might be empty
            return document;
          });
        } else {
          alert('No medical documents found.');
        }
      },
      error => {
        console.error('Error fetching documents:', error);
        alert('An error occurred while fetching the documents.');
      }
    );
  }
  
  
    // Open Upload Modal and automatically fetch medical documents
  openUploadModal(): void {
    this.isUploadModalOpen = true;
    this.fetchMedicalDocuments();  // Fetch medical documents when the modal opens
  }
  
    // Close Upload Modal
    closeUploadModal(): void {
      this.isUploadModalOpen = false;
    }
    // Submit the medical document for upload
  onUploadSubmit(): void {
    if (this.medicalDocumentBase64) {
      this.empRequestService.uploadMedicalDocument(this.loggedInEmployeeId, this.medicalDocumentBase64).subscribe(
        response => {
          if (response.status === 'success') {
            alert('Medical document uploaded successfully!');
            this.closeUploadModal();
          } else {
            alert('Error: ' + response.message);
          }
        },
        error => {
          console.error('Error uploading document:', error);
          alert('An error occurred while uploading the document.');
        }
      );
    } else {
      alert('Please select a document to upload.');
    }
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
