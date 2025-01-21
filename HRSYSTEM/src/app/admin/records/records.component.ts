import { Component, OnInit } from '@angular/core';
import { EmployeeRecordService } from './employee-record.service.service'; // Import the service

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any = null;
  loading: boolean = true;
  errorMessage: string = '';
  showRegisterModal: boolean = false;  // Flag to show the modal
  searchTerm: string = ''; // Variable for the search term
  // Declare the form data object to hold the employee data
  formData = {
    username: '',
    password: '123456',  // Default password
    email: '',
    account_type: 'Employee',
    system: 'Payroll',
    first_name: '',
    last_name: '',
    address: '',
    cellphone_number: '',
    sex: 'male',
    place_of_birth: '',
    barangay: '',
    province: '',
    vaccination_status: 'vaccinated',
    company: ''
  };

  constructor(private employeeRecordService: EmployeeRecordService) {}

  ngOnInit(): void {
    this.getEmployeeRecords();
  }
  filteredEmployees(): any[] {
    if (!this.searchTerm) {
      return this.employees; // Return all employees if no search term
    }
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    return this.employees.filter((employee) =>
      employee.id.toString().includes(lowerCaseTerm) ||
      (`${employee.first_name} ${employee.last_name}`.toLowerCase().includes(lowerCaseTerm))
    );
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

  // Open the registration modal
  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  // Close the registration modal
  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  toggleModal(employee: any): void {
    console.log('Selected Employee:', employee);
    this.selectedEmployee = this.selectedEmployee === employee ? null : employee;
  }
  

  // Method to generate a random username
  generateUsername(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      username += characters.charAt(randomIndex);
    }
    return username;
  }

  // Method to set the email automatically
  generateEmail(employeeId: number): string {
    return `2025-${employeeId}-@gmail.com`;
  }
    

  registerEmployee(): void {
    // Check for missing required fields
    if (!this.formData.first_name || !this.formData.last_name || !this.formData.address) {
      alert('First Name, Last Name, and Address are required!');
      return;
    }
  
    // Automatically generate username, email, and set password
    this.formData.username = this.generateUsername();
    this.formData.email = this.generateEmail(this.employees.length + 1);  // Example: generate email based on employee count
    this.formData.password = '123456';  // Default password
    
    // If the company (position) field is empty, assign a random position
    if (!this.formData.company) {
      this.formData.company = this.getRandomPosition();
    }
    
    // Log the formData to ensure everything is populated
    console.log('Form Data:', this.formData);
  
    this.loading = true;
  
    // Make the API call to register the employee
    this.employeeRecordService.registerEmployee(this.formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Employee registered successfully!');
          this.getEmployeeRecords(); // Refresh the employee list
          this.closeRegisterModal(); // Close the registration modal
        } else {
          alert('Error: ' + response.message);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error registering employee', err);
        alert('An error occurred while registering the employee.');
        this.loading = false;
      }
    });
  }
  
  // Method to get a random position (role)
  getRandomPosition(): string {
    const positions = [
      'Bagger', 
      'Cashier', 
      'Salesperson', 
      'Stock Clerk', 
      'Customer Service Representative', 
      'Store Manager', 
      'Security Guard', 
      'Inventory Specialist',
      'Floor Supervisor',
      'Technician'
    ];
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  }
  
  
}
