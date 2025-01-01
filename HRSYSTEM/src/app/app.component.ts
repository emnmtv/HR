import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // Service to handle authentication

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HRSYSTEM';
  collapsed = false;
  isCollapsed = false;
  isSidenavVisible = true;
  userRole: 'admin' | 'employee' | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Hide sidenav on the login page
    this.router.events.subscribe(() => {
      if (this.router.url.includes('login')) {
        this.isSidenavVisible = false;
      } else {
        this.isSidenavVisible = true;
      }
    });

    // Get the user role from AuthService
    this.userRole = this.authService.getUserRole();
  }

  toggleSidenav() {
    this.collapsed = !this.collapsed;
    this.isCollapsed = this.collapsed;
  }

  onSideNavToggle(event: { collapsed: boolean; screenWidth: number }) {
    this.isCollapsed = event.collapsed;
  }
}
