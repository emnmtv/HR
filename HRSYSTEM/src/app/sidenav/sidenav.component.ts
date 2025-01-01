import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { navbarDataAdmin, navbarDataEmployee } from './nav-data'; // Import separate nav data

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<boolean> = new EventEmitter();
  collapsed = false;
  navData: any[] = []; // Holds navigation data dynamically

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load account type from local storage
    const accountType = localStorage.getItem('accountType');

    // Set navigation data based on account type
    if (accountType === 'Admin') {
      this.navData = navbarDataAdmin;
    } else if (accountType === 'Employee') {
      this.navData = navbarDataEmployee;
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit(this.collapsed);
  }
  closeSidenav() {
    this.collapsed = true;
  }
  logout(): void {
    localStorage.clear(); // Clear user data
    this.router.navigate(['/login']);
  }
  
}
