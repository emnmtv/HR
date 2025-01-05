import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
  employeeDistributionChart: Chart | null = null;
  reportGenerated: boolean = false; // Track if report is generated
  attendanceSummary = { present: 0, absent: 0, late: 0 };
  employeesByPosition: any[] = []; // This will hold the filtered employee data

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
    this.dashboardService.getEmployeesPerCompany().subscribe((response) => {
      if (response.status === 'success') {
        this.employeesByPosition = response.data;
        console.log('Fetched Employees Per Position:', this.employeesByPosition);
        this.renderEmployeeDistributionChart(); // Re-render chart with new data
      } else {
        console.error('Failed to fetch employees per company:', response.message);
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

  // Destroy existing chart instance if it exists
  if (this.employeeDistributionChart) {
    this.employeeDistributionChart.destroy();
  }

  // Extract 'company' names and employee counts, but display them as 'position'
  const labels = this.employeesByPosition.map((entry) => entry.company || 'Unknown'); // Use 'company' here
  const data = this.employeesByPosition.map((entry) => entry.employee_count);

  // Softer pastel colors for each bar
  const pastelColors = [
    '#A8D5BA', '#FFB6B9', '#FFDAC1', '#FFE156', '#6A4C93', '#FF6F61', '#D4E157', 
    '#FFB74D', '#81C784', '#B2EBF2', // A set of calm pastel colors
  ];

  // Create a new chart
  this.employeeDistributionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,  // Labels will still be based on 'company' field, but will display as 'position'
      datasets: [
        {
          label: 'Employees per Position', // The label for this chart remains 'Employees per Position'
          data,
          backgroundColor: pastelColors.slice(0, labels.length), // Dynamically slice colors for the labels
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

  generatePDF() {
    // Get the dashboard content as a screenshot (including charts)
    html2canvas(document.querySelector('.dashboard-container')!).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
  
      // Add the screenshot as an image to the PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 120);
  
      // Add a title or custom content (e.g., total employees, requests, etc.)
      pdf.setFontSize(16);
      pdf.text('HR Dashboard Report', 10, 140);
      pdf.setFontSize(12);
      pdf.text(`Total Employees: ${this.totalEmployees}`, 10, 150);
      pdf.text(`Pending Requests: ${this.pendingRequests}`, 10, 160);
      pdf.text(`Approved Requests: ${this.approvedRequests}`, 10, 170);
      pdf.text(`Rejected Requests: ${this.rejectedRequests}`, 10, 180);
  
      // Add Attendance Report Section
      pdf.text('Attendance Summary:', 10, 190);
      pdf.text(`Present: ${this.attendanceSummary.present}`, 10, 200);
      pdf.text(`Absent: ${this.attendanceSummary.absent}`, 10, 210);
      pdf.text(`Late: ${this.attendanceSummary.late}`, 10, 220);
  
      // Save the PDF
      pdf.save('HR_Dashboard_Report.pdf');
    });
  }
  
  // New function to print the content
  printReport() {
    const content = document.querySelector('.dashboard-container')!;
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(content.innerHTML);
  
    // Add the Attendance Report to the print window
    const attendanceReport = `
      <h3>Attendance Summary:</h3>
      <p>Present: ${this.attendanceSummary.present}</p>
      <p>Absent: ${this.attendanceSummary.absent}</p>
      <p>Late: ${this.attendanceSummary.late}</p>
    `;
    
    printWindow?.document.write(attendanceReport);
  
    printWindow?.document.close();
    printWindow?.print();
  }
  
}
