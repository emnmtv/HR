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
    this.errorMessage = '';  // Clear any previous error messages
  
    this.loginService.login(this.email, this.password, this.accountType).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log('Login successful:', response);
          localStorage.setItem('user', JSON.stringify(response.user));  // Store user data if needed
  
          // Redirect based on account type or a specific path
          if (response.user.account_type === 'Admin') {
            this.router.navigate(['/dashboard']);
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