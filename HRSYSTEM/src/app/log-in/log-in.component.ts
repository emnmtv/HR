import { Component } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  isChecked = false;
  email: string = '';
  password: string = '';
  name: string = '';

  onLogin() {
    // Handle login logic here
    console.log('Logging in with', this.email, this.password);
  }
}
