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
  
  showModal: boolean = false; // Modal visibility
  modalMessage: string = ''; // Modal message
  constructor(private employeeRequestService: EmployeeRequestService) {}

  ngOnInit(): void {
    this.loadAllEmployees();
  }
  filterRequests(status: string): void {
    this.currentFilter = status;
    if (status === 'all') {
      this.filteredRequests = this.allRequests;
    } else {
      this.filteredRequests = this.allRequests.filter(
        (request) => request.status.toLowerCase() === status.toLowerCase()
      );
    }
  }
  
  // Fetch all employees and their requests
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

  // Fetch requests for all employees and link them with employee data
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
  closeModal(): void {
    this.showModal = false; // Close the modal
  }

  // Get the appropriate CSS class based on status
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
