import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  accountType: string = 'Admin'; // Default account type, can be dynamically set if needed

  constructor(private loginService: LoginService, private router: Router) {}

  // This method will be triggered on form submission
  onLogin() {
    this.errorMessage = '';  // Clear previous errors
  
    this.loginService.login(this.email, this.password, this.accountType).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Login successful:', response);
  
          // Save user details and employee ID in local storage
          localStorage.setItem('user', JSON.stringify(response.user));  // Save entire user data
          localStorage.setItem('accountType', response.user.account_type);
          localStorage.setItem('employee_id', response.user.id.toString());  // Save employee ID
  
          // Redirect based on account type
          if (response.user.account_type === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.user.account_type === 'Employee') {
            this.router.navigate(['/employeedash']);
          }
        } else {
          this.errorMessage = response.message || 'Invalid credentials';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to connect to the backend';
        console.error(error);
      }
    );
  }
  

}