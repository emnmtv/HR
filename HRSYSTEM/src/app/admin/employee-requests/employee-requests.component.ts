import { Component, OnInit } from '@angular/core';
import { EmployeeRequestService } from './employee-request.service';

@Component({
  selector: 'app-employee-requests',
  templateUrl: './employee-requests.component.html',
  styleUrls: ['./employee-requests.component.scss']
})
export class EmployeeRequestsComponent implements OnInit {
  employees: any[] = [];
  allRequests: any[] = [];
  employeeMap: Map<number, any> = new Map(); // To map employee ID to employee data
  filteredRequests: any[] = [];
  currentFilter: string = 'all'; // Default filter
  
  showModal: boolean = false; // Modal visibility for request actions
  showMessageModal: boolean = false; // Modal visibility for sending a message
  showNewMessageModal: boolean = false; // Modal visibility for sending a new message
  modalMessage: string = ''; // Modal message
  selectedEmployeeId: number = 0; // Store selected employee ID for message
  
  messageContent: string = ''; // Content of the message
  newEmployeeId: number = 0; // New Employee ID for message
  newMessageContent: string = ''; // New Message Content
  showNotification: boolean = false; // For showing/hiding notification
  notificationMessage: string = ''; // Notification message
  showImageModal: boolean = false; // To control the image modal visibility
  selectedImagePath: string = ''; // To store the image path for viewing

  constructor(private employeeRequestService: EmployeeRequestService) {}

  ngOnInit(): void {
    this.loadAllEmployees();
  }

  filterRequests(status: string): void {
    this.currentFilter = status;
    if (status === 'all') {
      this.filteredRequests = this.allRequests;
    } else if (status === 'blank') {
      this.filteredRequests = this.allRequests.filter(
        (request) => !request.type || request.type.trim() === ''
      );
    } else {
      this.filteredRequests = this.allRequests.filter(
        (request) => request.status.toLowerCase() === status.toLowerCase()
      );
    }
  }

  loadAllEmployees(): void {
    this.employeeRequestService.getEmployeeData().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.employees = response.data;
          this.employees.forEach((employee) => {
            // Storing employee data in the map using employee_id as key
            this.employeeMap.set(employee.id, {
              name: `${employee.first_name} ${employee.last_name}`,
              company: employee.company
            });
          });
          this.loadAllRequestsForEmployees(); // Once employees are loaded, fetch their requests
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  loadAllRequestsForEmployees(): void {
    this.allRequests = []; // Reset the requests array
    this.employees.forEach((employee) => {
      this.employeeRequestService.fetchUserRequests(employee.id).subscribe(
        (response) => {
          if (response.status === 'success') {
            response.data.forEach((request: any) => {
              const employeeData = this.employeeMap.get(employee.id);
              this.allRequests.push({
                ...request,
                employee_name: employeeData.name,
                company: employeeData.company,
                // Prepend the correct base URL for the image path
                image_path: request.image_path ? `http://localhost/integapi/main/${request.image_path}` : '', 
              });
            });
            this.filterRequests(this.currentFilter); // Apply the current filter
          } else {
            console.error(`Error fetching requests for employee ${employee.id}:`, response.message);
          }
        },
        (error) => {
          console.error(`Error fetching requests for employee ${employee.id}:`, error);
        }
      );
    });
  }
  
   // Open image modal to view photo
   viewImage(imagePath: string): void {
    this.selectedImagePath = imagePath;
    this.showImageModal = true;
  }

  // Close the image view modal
  closeImageModal(): void {
    this.showImageModal = false;
  }
  

  // Handle the button action to approve/reject requests
  handleRequestAction(requestId: number, action: 'approve' | 'reject', employeeId: number): void {
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    this.updateRequestStatus(requestId, status, employeeId); // Pass employeeId along with requestId and status
  }

  // Update request status
  updateRequestStatus(requestId: number, status: string, employeeId: number): void {
    this.employeeRequestService.updateRequestStatus(requestId, status, employeeId).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Request status updated');
          this.modalMessage = `Request has been successfully ${status.toLowerCase()}.`;
          this.showModal = true; // Show the modal
          this.loadAllRequestsForEmployees(); // Reload the requests after update
        } else {
          console.error('Error updating request status:', response.message);
        }
      },
      (error) => {
        console.error('Error updating request status:', error);
      }
    );
  }

  // Open send message modal for a specific employee
  openMessageModal(employeeId: number): void {
    this.selectedEmployeeId = employeeId;
    this.messageContent = ''; // Clear previous message content
    this.showMessageModal = true; // Open modal
  }

  // Open the modal for sending a new message
  openNewMessageModal(): void {
    this.newEmployeeId = 0;
    this.newMessageContent = '';
    this.showNewMessageModal = true; // Open new message modal
  }

  // Close message modal
  closeMessageModal(): void {
    this.showMessageModal = false; // Close modal
  }

  // Close new message modal
  closeNewMessageModal(): void {
    this.showNewMessageModal = false; // Close modal
  }

  // Send message to a specific employee
sendMessage(): void {
  const message = this.messageContent.trim();
  if (message) {
    const body = {
      employee_id: this.selectedEmployeeId,
      message: message,
    };
    this.employeeRequestService.sendMessage(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Message sent successfully');
          this.showNotificationMessage('Message sent successfully');
          this.closeMessageModal();
        } else {
          console.error('Error sending message:', response.message);
        }
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
}

// Send message to a new employee (via Employee ID and Message)
sendNewMessage(): void {
  const message = this.newMessageContent.trim();
  const employeeId = this.newEmployeeId;
  if (message && employeeId) {
    const body = {
      employee_id: employeeId,
      message: message,
    };
    this.employeeRequestService.sendMessage(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Message sent successfully');
          this.showNotificationMessage('Message sent successfully');
          this.closeNewMessageModal();
        } else {
          console.error('Error sending message:', response.message);
        }
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
}

// Show notification message
showNotificationMessage(message: string): void {
  this.notificationMessage = message;
  this.showNotification = true;

  // Hide notification after 1 second
  setTimeout(() => {
    this.showNotification = false;
  }, 1500);
}

  closeModal(): void {
    this.showModal = false; // Close the request action modal
  }

  // Get the appropriate CSS class based on status
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
