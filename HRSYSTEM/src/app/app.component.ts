import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HRSYSTEM'; // Application title
  collapsed = false; // Track the sidenav state
  isSidenavVisible = true; // Control sidenav visibility

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRouteVisibility(); // Check route visibility on load

    // Detect navigation changes
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.checkRouteVisibility();
      }
    });
  }

  private checkRouteVisibility() {
    // Hide sidenav for login route
    this.isSidenavVisible = !this.router.url.includes('login');
  }

  toggleSidenav() {
    // Toggle the sidenav's collapsed state
    this.collapsed = !this.collapsed;
  }
}
