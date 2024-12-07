import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HRSYSTEM';  // Application title
  collapsed = false;  // Track the state of the sidenav (collapsed or expanded)
  isCollapsed = false;  // Track if the sidenav is collapsed
  isSidenavVisible = true;  // Control sidenav visibility

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to check when the route changes
    this.router.events.subscribe((event: any) => {
      // Check if the current route is login
      if (this.router.url.includes('login')) {
        this.isSidenavVisible = false;  // Hide sidenav if route is 'login'
      } else {
        this.isSidenavVisible = true;  // Show sidenav for other routes
      }
    });
  }

  // Method to handle the toggle event from the sidenav
  toggleSidenav() {
    this.collapsed = !this.collapsed;  // Toggle the collapsed state
    this.isCollapsed = this.collapsed;  // Update the content's collapsed state as well
  }

  // Method to update layout based on sidenav state
  onSideNavToggle(event: { collapsed: boolean, screenWidth: number }) {
    this.isCollapsed = event.collapsed;
  }
}
