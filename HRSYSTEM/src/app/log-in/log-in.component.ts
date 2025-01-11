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
  isLoading: boolean = false;    // For controlling modal visibility

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.errorMessage = '';  // Clear previous errors
    this.isLoading = true;    // Show loading modal

    // Simulate a delay for showing the modal
    setTimeout(() => {
      this.loginService.login(this.email, this.password, this.accountType).subscribe(
        (response) => {
          this.isLoading = false; // Hide modal when response comes
          if (response.status === 'success') {
            console.log('Login successful:', response);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('accountType', response.user.account_type);
            localStorage.setItem('employee_id', response.user.id.toString());

            if (response.user.account_type === 'Admin') {
              this.router.navigate(['/dashboard']);
            } else if (response.user.account_type === 'Employee') {
              this.router.navigate(['/employeedash']);
            }
          } else {
            this.errorMessage = response.message || 'Invalid credentials';
            // Show error modal here
            this.isLoading = false;
          }
        },
        (error) => {
          this.isLoading = false; // Hide modal on error
          this.errorMessage = 'Failed to connect to the backend';
          console.error(error);
        }
      );
    }, 1000);  // Simulate a 1-second delay before the login process
  }
}
