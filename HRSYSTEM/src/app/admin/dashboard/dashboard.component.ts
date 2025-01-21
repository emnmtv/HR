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
  // Modal State
  
  modalVisible: boolean = false;
  selectedCompany: string = '';
  employeeList: any[] = [];
    // New report fields
    attendanceReport: string = '';
    employeeDistributionReport: string = '';
    requestReport: string = ''; // Added for request summary
    reportModalVisible: boolean = false;  // Modal visibility for report options
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchEmployeeData(); // Fetch employee data on init'
    
  }
  openReportModal() {
    this.reportModalVisible = true;
  }

  closeReportModal() {
    this.reportModalVisible = false;
  }
  refreshDashboard() {
    // Trigger API to check attendance and update dashboard
    this.dashboardService.checkAttendance().subscribe((response) => {
      if (response.status === 'success') {
        console.log('Attendance check completed successfully');
        this.fetchDashboardData(); // Re-fetch the dashboard data after attendance check
        this.fetchEmployeeData(); // Re-fetch employee data if needed
      } else {
        console.error('Error checking attendance:', response.message);
      }
    });
  }
  
// New method to generate the request report
generateRequestReport() {
  const { pendingRequests, approvedRequests, rejectedRequests } = this;

  let requestExplanation = `The request summary is as follows:
  - Pending Requests: ${pendingRequests}
  - Approved Requests: ${approvedRequests}
  - Rejected Requests: ${rejectedRequests}`;

  if (pendingRequests > approvedRequests && pendingRequests > rejectedRequests) {
    requestExplanation += " There are many requests still pending. Consider reviewing them soon.";
  } else if (approvedRequests > rejectedRequests) {
    requestExplanation += " Most requests are being approved, indicating that the process is running smoothly.";
  } else {
    requestExplanation += " A significant number of requests are being rejected, which may need further attention.";
  }

  this.requestReport = requestExplanation; // Set the dynamic report for requests
}
    // New method to generate the attendance report
    generateAttendanceReport() {
      const { present, absent, late } = this.attendanceSummary;
  
      let attendanceExplanation = `The attendance summary for the latest period shows:
      - Present: ${present} employees
      - Absent: ${absent} employees
      - Late: ${late} employees.`;
  
      if (present > absent && present > late) {
        attendanceExplanation += " Overall, the attendance is good, with most employees present on time.";
      } else if (late > absent) {
        attendanceExplanation += " There seems to be a significant number of late arrivals. Addressing punctuality could be beneficial.";
      } else {
        attendanceExplanation += " A considerable number of employees were absent. This might need further investigation.";
      }
  
      this.attendanceReport = attendanceExplanation; // Set the dynamic report
    }
  
    // New method to generate the employee distribution report
    generateEmployeeDistributionReport() {
      if (this.employeesByPosition.length === 0) {
        this.employeeDistributionReport = "No data available for employee distribution.";
        return;
      }
  
      const totalEmployees = this.employeesByPosition.reduce((sum, entry) => sum + entry.employee_count, 0);
      let distributionExplanation = `The employee distribution across positions is as follows:\n`;
  
      this.employeesByPosition.forEach((entry) => {
        distributionExplanation += `- ${entry.company}: ${entry.employee_count} employees (${((entry.employee_count / totalEmployees) * 100).toFixed(2)}% of total employees)\n`;
      });
  
      if (this.employeesByPosition.length > 1) {
        distributionExplanation += " There is a balanced distribution of employees across different positions.";
      } else {
        distributionExplanation += " The company may benefit from a more diverse set of positions or roles.";
      }
  
      this.employeeDistributionReport = distributionExplanation; // Set the dynamic report
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
  closeModal() {
    this.modalVisible = false; // Hide the modal
    this.selectedCompany = ''; // Reset selected company
    this.employeeList = []; // Clear the employee list
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
        this.generateRequestReport();
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
    this.generateAttendanceReport();
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
  
    // Extract labels (positions) and employee counts
    const labels = this.employeesByPosition.map((entry) => entry.company || 'Unknown'); // Positions
    const data = this.employeesByPosition.map((entry) => entry.employee_count);
  
    // Map labels to actual backend `company` values
    const labelToCompanyMap = this.employeesByPosition.reduce((map, entry) => {
      map[entry.company || 'Unknown'] = entry.company; // Map 'Unknown' labels to actual company names
      return map;
    }, {} as { [key: string]: string });
  
    const pastelColors = ['#A8D5BA', '#FFB6B9', '#FFDAC1', '#FFE156', '#6A4C93'];
  
    // Create the chart
    this.employeeDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Employees per Position',
            data,
            backgroundColor: pastelColors.slice(0, labels.length),
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index; // Get the index of the clicked bar
            const selectedLabel = labels[index]; // Get the label (position) for the clicked bar
            const selectedCompany = labelToCompanyMap[selectedLabel]; // Map label to the actual company
            if (selectedCompany) {
              console.log('Selected Company:', selectedCompany);
              this.showEmployeeModal(selectedCompany); // Pass company to modal
            } else {
              console.error('No company mapped for the selected label:', selectedLabel);
            }
          }
        },
      },
    });
    this.generateEmployeeDistributionReport(); // Call it after chart rendering to update the report
  }
  
  
  showEmployeeModal(company: string) {
    if (!company) {
      console.error('Company is undefined or missing');
      return;
    }

    this.selectedCompany = company; // Set the company for modal
    this.modalVisible = true; // Show the modal

    this.dashboardService.getEmployeeDataByCompany(company).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.employeeList = response.data; // Populate employee list
        } else {
          console.error('Failed to fetch employees:', response.message);
          this.employeeList = [];
        }
      },
      (error) => {
        console.error('API call failed:', error);
        this.employeeList = [];
      }
    );
  }
  
  
  

  generatePDF() {
    const pdf = new jsPDF();
    const margin = 10;  // Define margin
    let currentY = margin + 10;  // Start position for the content
  
    // Set title style
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('HR Dashboard Automatic Report', margin, currentY);
    currentY += 20; // Add space after the title
  
    // Add Automatic Reports Section Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Automatic Reports', margin, currentY);
    currentY += 15; // Add space after section title
  
    // Attendance Report Summary
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Attendance Report Summary', margin, currentY);
    currentY += 10; // Add space after the report title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    this.addTextToPDF(pdf, this.attendanceReport, margin, currentY);
    currentY += this.calculateTextHeight(this.attendanceReport) + 20;
  
    // Employee Distribution Report Summary
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Employee Distribution Report Summary', margin, currentY);
    currentY += 10; // Add space after the report title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    this.addTextToPDF(pdf, this.employeeDistributionReport, margin, currentY);
    currentY += this.calculateTextHeight(this.employeeDistributionReport) + 20;
  
    // Request Report Summary
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Request Report Summary', margin, currentY);
    currentY += 10; // Add space after the report title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    this.addTextToPDF(pdf, this.requestReport, margin, currentY);
    currentY += this.calculateTextHeight(this.requestReport) + 20;
  
    // Save the PDF
    pdf.save('HR_Dashboard_Automatic_Report.pdf');
  }
  
  // Utility to add text with wrapping
  addTextToPDF(pdf: jsPDF, text: string, x: number, y: number) {
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const lineHeight = 10;
    let cursorY = y;
    let textLines = pdf.splitTextToSize(text, pageWidth - 2 * x); // Wrap the text to fit page width
  
    // Check if text overflows the page, and move to the next page if needed
    for (let i = 0; i < textLines.length; i++) {
      if (cursorY + lineHeight > pageHeight - 10) { // Use 10 as margin instead of 'margin'
        pdf.addPage();  // Add new page if text overflows
        cursorY = 10; // Reset Y to the top of the new page
      }
      pdf.text(textLines[i], x, cursorY);
      cursorY += lineHeight;
    }
  }
  
  // Utility to calculate text height based on the content
  calculateTextHeight(text: string) {
    const lineHeight = 10;
    const lines = text.split("\n").length;
    return lines * lineHeight;
  }
  
  
  
  
  
  // New function to print the content
 // New function to print the content
 printReport() {
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HR Dashboard Automatic Report</title>
        <style>
          /* General styling */
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.8;
            background-color: #f4f7fa;
          }

          .header {
            text-align: center;
            background-color: #007bff;
            color: white;
            padding: 20px 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 2px;
          }

          /* Content section */
          .content {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .content h3 {
            font-size: 22px;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .report-summary {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-left: 5px solid #007bff;
            border-radius: 5px;
          }

          .report-summary h4 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .report-summary p {
            font-size: 15px;
            color: #555;
            margin-top: 5px;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }

          /* Print-specific styles */
          @media print {
            body {
              background-color: white;
              margin: 0;
              padding: 20px;
            }
            .content {
              max-width: 100%;
              box-shadow: none;
              margin-top: 20px;
              padding: 15px;
            }
            .footer {
              margin-top: 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>HR Dashboard Automatic Report</h1>
        </div>
        <div class="content">
          <!-- Automatic Reports Section -->
          <div class="automatic-report-section">
            <h3>Automatic Reports</h3>

            <div class="report-summary">
              <h4>Attendance Report Summary</h4>
              <p>${this.attendanceReport}</p>
            </div>

            <div class="report-summary">
              <h4>Employee Distribution Report Summary</h4>
              <p>${this.employeeDistributionReport}</p>
            </div>

            <div class="report-summary">
              <h4>Request Report Summary</h4>
              <p>${this.requestReport}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2025 HR Dashboard. All Rights Reserved.</p>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  } else {
    console.error('Failed to open print window');
  }
}



  
}
