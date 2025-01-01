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

  // Static logic for department data
  departmentData = [
    { name: 'Operations', count: 50 },
    { name: 'HR', count: 20 },
    { name: 'Finance', count: 15 },
    { name: 'Cashier', count: 40 },
    { name: 'Custodian', count: 40 },
    { name: 'Bagger', count: 25 },
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
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
        layout: {
          padding: 20,
        },
      },
    });
  }

  renderDepartmentChart() {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departmentData.map((dept) => dept.name),
        datasets: [
          {
            label: 'Employees',
            data: this.departmentData.map((dept) => dept.count),
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Employee Distribution by Department',
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          y: {
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
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
