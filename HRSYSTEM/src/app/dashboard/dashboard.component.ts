import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Add employees property
  employees = {
    total: 300,
    workFromHome: 132,
    onVacation: 26,
    dayOff: 12,
    sickLeave: 22,
  };

  jobApplications = [
    { id: 1, name: 'Rodger Black', position: 'Senior Graphic Designer', status: 'Pending' },
    { id: 2, name: 'Chris Giesler', position: 'Java Developer', status: 'Pending' },
    { id: 3, name: 'Stephanie Nicole', position: 'Full Stack Developer', status: 'Pending' },
  ];

  requests = [
    { id: 1, name: 'Kathy Pacheco', period: 'Full Day', type: 'Day Off', status: 'Pending', date: 'Today', notes: 'I need to stay with my parents' },
    { id: 2, name: 'Samantha Pacheco', period: '3 Jul - 12 Jul', type: 'Vacation', status: 'Pending', date: 'Today', notes: 'Annual vacation' },
    { id: 3, name: 'Jush De Guzman', period: 'November 22', type: 'Vacation', status: 'Pending', date: 'Today', notes: 'Birthday' },
  ];

  ngOnInit(): void {
    this.loadStoredData();
  }

  handleJobApplication(action: string, application: any): void {
    application.status = action;
    this.saveToLocalStorage();
  }

  handleRequest(action: string, request: any): void {
    request.status = action;
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('jobApplications', JSON.stringify(this.jobApplications));
    localStorage.setItem('requests', JSON.stringify(this.requests));
  }

  private loadStoredData(): void {
    const storedJobApplications = localStorage.getItem('jobApplications');
    const storedRequests = localStorage.getItem('requests');

    if (storedJobApplications) {
      this.jobApplications = JSON.parse(storedJobApplications);
    }

    if (storedRequests) {
      this.requests = JSON.parse(storedRequests);
    }
  }
}
