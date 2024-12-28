import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalEmployees = 150;
  pendingRequests = 20;
  activeJobOpenings = 5;
  upcomingBirthdays = 8;

  recentActivities = [
    { timestamp: '2024-12-01 10:00 AM', description: 'Approved work-from-home request for John Doe' },
    { timestamp: '2024-12-01 09:30 AM', description: 'Added a new job posting for Software Developer' },
    { timestamp: '2024-12-01 08:45 AM', description: 'Updated attendance records for November' },
  ];

  ngOnInit() {
    this.renderAttendanceChart();
    this.renderDepartmentChart();
  }

  renderAttendanceChart() {
    const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'On Leave'],
        datasets: [
          {
            data: [75, 15, 10],
            backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
          },
        ],
      },
    });
  }

  renderDepartmentChart() {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Operations', 'HR', 'Finance', 'IT', 'Marketing'],
        datasets: [
          {
            label: 'Employees',
            data: [50, 20, 15, 40, 25],
            backgroundColor: '#4caf50',
          },
        ],
      },
    });
  }

  addEmployee() {
    alert('Redirecting to Add Employee form...');
  }

  approveRequests() {
    alert('Redirecting to Approve Requests page...');
  }

  viewReports() {
    alert('Redirecting to Reports...');
  }

  postJobOpening() {
    alert('Redirecting to Post Job Opening form...');
  }
}
