import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalEmployees: number = 0;
  pendingRequests: number = 0;
  approvedRequests: number = 0;
  rejectedRequests: number = 0;

  attendanceSummary = { present: 0, absent: 0, late: 0 };
  employeesByCompany: any[] = []; // This will hold the filtered employee data

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchEmployeeData(); // Fetch employee data on init
  }

  ngAfterViewInit() {
    this.dashboardService.getAttendanceData().subscribe((response) => {
      if (response.status === 'success') {
        this.attendanceSummary = {
          present: response.data.present,
          absent: response.data.absent,
          late: response.data.late,
        };
        this.renderAttendanceChart();
      }
    });

    this.renderEmployeeDistributionChart(); // Render employee chart after view init
  }

  fetchDashboardData() {
    this.dashboardService.getEmployeeCount().subscribe((response) => {
      if (response.status === 'success') {
        this.totalEmployees = response.total_employees;
      }
    });

    this.dashboardService.getRequestCounts().subscribe((response) => {
      if (response.status === 'success') {
        this.pendingRequests = response.pending_requests;
        this.approvedRequests = response.approved_requests;
        this.rejectedRequests = response.rejected_requests;
      }
    });
  }
  fetchEmployeeData() {
    const filters = { company: 'YourCompanyName' };
  
    this.dashboardService.getEmployeeData(filters).subscribe((response) => {
      if (response.status === 'success') {
        this.employeesByCompany = response.data;
        console.log('Fetched Employees:', this.employeesByCompany); // Debugging output
        this.renderEmployeeDistributionChart(); // Call chart rendering here
      }
    });
  }
  

  renderAttendanceChart() {
    const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Attendance Chart element not found');
      return;
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Late'],
        datasets: [
          {
            data: [
              this.attendanceSummary.present,
              this.attendanceSummary.absent,
              this.attendanceSummary.late,
            ],
            backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

  renderEmployeeDistributionChart() {
    const ctx = document.getElementById('employeeDistributionChart') as HTMLCanvasElement;
  
    if (!ctx) {
      console.error('Employee Distribution Chart element not found');
      return;
    }
  
    console.log('Employees by Company:', this.employeesByCompany); // Debugging output
  
    const companyCounts: { [company: string]: number } = {};
    this.employeesByCompany.forEach((employee) => {
      const companyName = employee.company || 'Unknown';
      companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
    });
  
    const labels = Object.keys(companyCounts);
    const data = Object.values(companyCounts);
  
    console.log('Labels:', labels); // Debugging output
    console.log('Data:', data); // Debugging output
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Employees per Company',
            data: data,
            backgroundColor: '#42a5f5',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
  
}
