import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  // Add employees property
  employees = {
    total: 300,
    onVacation: 26,
    sickLeave: 22,
  };


  requests = [
    { id: 1, name: 'Kathy Pacheco', period: 'Full Day', type: 'Day Off', status: 'Pending', date: 'Today', notes: 'I need to stay with my parents' },
    { id: 2, name: 'Samantha Pacheco', period: '3 Jul - 12 Jul', type: 'Vacation', status: 'Pending', date: 'Today', notes: 'Annual vacation' },
    { id: 3, name: 'Jush De Guzman', period: 'November 22', type: 'Vacation', status: 'Pending', date: 'Today', notes: 'Birthday' },
  ];

  ngOnInit(): void {
    this.loadStoredData();
  }


  handleRequest(action: string, request: any): void {
    request.status = action;
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('requests', JSON.stringify(this.requests));
  }

  private loadStoredData(): void {
    const storedRequests = localStorage.getItem('requests');

    if (storedRequests) {
      this.requests = JSON.parse(storedRequests);
    }
  }
}
