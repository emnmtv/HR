import { Component } from '@angular/core';
import { LoginService } from '../login.service'; // Adjust the path if necessary

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService) {}

  // This method will be triggered on form submission
  onLogin() {
    // Call the login method from LoginService
    this.loginService.login(this.email, this.password).subscribe(
      (response) => {
        if (response.status === 'success') {
          // Handle successful login, e.g., redirect to dashboard
          console.log('Login successful:', response);
          // Optionally redirect to another page, e.g., using Angular's Router
        } else {
          // Handle login failure
          this.errorMessage = response.message || 'An error occurred';
        }
      },
      (error) => {
        // Handle HTTP error
        this.errorMessage = 'Failed to connect to the backend';
        console.error(error);
      }
    );
  }
}
