import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss'],
})
export class AdminProfileComponent implements OnInit {
  user = {
    id: 0,
    username: '',
    email: '',
    account_type: '',
    first_name: '',
    last_name: '',
    address: '',
    cellphone_number: '',
    sex: '',
    place_of_birth: '',
    barangay: '',
    province: '',
    vaccination_status: '',
    company: '',
    created_at: '',
    profilePictureUrl: '', // Add a default placeholder or manage dynamically
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    const employeeId = localStorage.getItem('employee_id');
    console.log('Employee ID from localStorage:', employeeId);
    if (employeeId) {
      this.fetchEmployeeData(+employeeId);
    } else {
      console.warn('No Employee ID found in localStorage.');
    }
  }
  

  fetchEmployeeData(employeeId: number) {
    this.employeeService.getAllEmployees().subscribe(
      (response) => {
        console.log('All Employees:', response); // Debugging step
        if (response.status === 'success') {
          const employee = response.data.find((emp: any) => emp.id === employeeId);
          if (employee) {
            console.log('Filtered Employee:', employee); // Debugging step
            this.user = {
              ...this.user,
              ...employee,
              profilePictureUrl: employee.profilePictureUrl || 'https://via.placeholder.com/150', // Fallback
            };
          } else {
            console.warn('No matching employee found for ID:', employeeId);
          }
        } else {
          console.error('API Error:', response.message);
        }
      },
      (error) => {
        console.error('Network/API Error:', error);
      }
    );
  }
  
}
