import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
interface AttendanceEntry {
  date: string;
  status: string;
}
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
    
    attendanceData: any[] = [];
    filteredAttendance: any[] = [];
    attendanceFilter: string = ''; // Empty initially, meaning no filter
    searchQuery: string = ''; // Empty initially

    modalVisible3: boolean = false;
    isModalVisible: boolean = false;
    employeeId: string = '';
    reportType: string = 'all'; // Default report type
    
    attendanceData2: AttendanceEntry[] = []; // Define the type of the attendance data
    totalHours: number = 0;
    presentCount: number = 0;
    absentCount: number = 0;
    lateCount: number = 0;
    evaluations: string = '';
    employeeDetails: { name: string; company: string; email: string } = { name: '', company: '', email: '' };
    showAllAttendance: boolean = false;
    selectedReportType: string = 'summary'; // Default to summary
    isPrintModalVisible = false;

    currentDate: string = '';
    
    
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchEmployeeData(); // Fetch employee data on init'
    this.fetchAttendanceData();
    this.currentDate = new Date().toLocaleDateString(); // Format as per user's locale
    
  }

  // Function to open the print modal
  openPrintModal() {
    this.isPrintModalVisible = true;
  }

  // Function to close the print modal
  closePrintModal() {
    this.isPrintModalVisible = false;
  }

   // Function to handle the selection of the print option
   printReport2(reportType: string) {
    this.selectedReportType = reportType;
    this.closePrintModal();
    this.generatePrintLayout();
  }

  generatePrintLayout() {
    let reportHTML = '';
    
    // Shared Employee Details Section with Styling
    const employeeDetailsSection = `
      <div style="margin-bottom: 20px;">
        <p><strong style="font-size: 18px; color: #333;">Employee Name:</strong> <span style="font-size: 16px;">${this.employeeDetails.name}</span></p>
        <p><strong style="font-size: 18px; color: #333;">Company:</strong> <span style="font-size: 16px;">${this.employeeDetails.company}</span></p>
        <p><strong style="font-size: 18px; color: #333;">Email:</strong> <span style="font-size: 16px;">${this.employeeDetails.email}</span></p>
      </div>
    `;
    
    // Shared Attendance Summary Section with Styling
    const attendanceSummary = `
      <h3 style="color: #4CAF50;">Attendance Summary</h3>
      <p><strong>Total Present:</strong> <span style="font-size: 16px;">${this.presentCount}</span></p>
      <p><strong>Total Absent:</strong> <span style="font-size: 16px;">${this.absentCount}</span></p>
      <p><strong>Total Late:</strong> <span style="font-size: 16px;">${this.lateCount}</span></p>
      <p><strong>Attendance Rate:</strong> <span style="font-size: 16px; color: ${this.presentCount / (this.presentCount + this.absentCount + this.lateCount) * 100 < 75 ? 'red' : 'green'};">
        ${(this.presentCount / (this.presentCount + this.absentCount + this.lateCount) * 100).toFixed(2)}%</span>
      </p>
    `;
    
    // Full Report Layout: Display Attendance Data (for 'full' report type)
    const attendanceDetails = `
      <h3 style="color: #4CAF50;">Attendance Records</h3>
      <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f2f2f2; text-align: left;">
            <th style="padding: 8px; color: #333;">Date</th>
            <th style="padding: 8px; color: #333;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${this.attendanceData2.map((entry: AttendanceEntry) => `
            <tr style="background-color: ${this.attendanceData2.indexOf(entry) % 2 === 0 ? '#f9f9f9' : '#fff'};">
              <td style="padding: 8px; text-align: left;">${entry.date}</td>
              <td style="padding: 8px; text-align: left;">${entry.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    // Add Evaluation Section with Styling
    const evaluationSection = `
      <h3 style="color: #4CAF50;">Evaluation</h3>
      <p style="font-size: 16px; color: #555;">${this.evaluations}</p>
    `;
    
    // Generate Report Layout Based on the Selected Report Type
    if (this.selectedReportType === 'summary') {
      // Include only the summary details, along with evaluations
      reportHTML = `
        <h1 style="font-size: 24px; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Attendance Summary Report</h1>
        ${employeeDetailsSection}
        ${attendanceSummary}
        ${evaluationSection}
      `;
    } else {
      // Full Report Layout, includes employee details, attendance records, and evaluation
      reportHTML = `
        <h1 style="font-size: 24px; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Full Attendance Report</h1>
        ${employeeDetailsSection}
        ${attendanceSummary}
        ${attendanceDetails}
        ${evaluationSection}
      `;
    }
  
    // Open the print window with the generated HTML and enhanced styling
    const printWindow = window.open('', '_blank');
    if (printWindow) {  // Check if printWindow is not null
      printWindow.document.write(`
        <html>
          <head>
            <title>Attendance Report</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                color: #333;
              }
              h1 { 
                font-size: 24px; 
                color: #333; 
                border-bottom: 2px solid #4CAF50; 
                padding-bottom: 10px; 
              }
              h3 { 
                color: #4CAF50; 
              }
              p { 
                font-size: 16px; 
                line-height: 1.6;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
              }
              th, td { 
                padding: 8px; 
                text-align: left; 
                border: 1px solid #ddd; 
              }
              th { 
                background-color: #f2f2f2;
              }
              tr:nth-child(even) { 
                background-color: #f9f9f9; 
              }
            </style>
          </head>
          <body>
            ${reportHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
    }
  }
  
  
  toggleAttendanceDetails() {
    this.showAllAttendance = !this.showAllAttendance;
  }
  openModal4() {
    this.isModalVisible = true;
  }

  closeModal4() {
    this.isModalVisible = false;
  }

  generateReport() {
    if (this.employeeId) {
      // Fetch attendance data, which also includes employee details
      this.dashboardService.getEmployeeAttendanceData(this.employeeId).subscribe(
        (data) => {
          if (data.status === 'success') {
            // Extract employee details and attendance data from the response
            this.employeeDetails = data.data.employee;
            this.attendanceData2 = data.data.attendance_records;
            this.totalHours = data.data.total_hours;
            this.presentCount = data.data.present_count;
            this.absentCount = data.data.absent_count;
            this.lateCount = data.data.late_count;
  
            this.evaluateData();
            this.generateReportBasedOnType();
          } else {
            console.error('Error fetching employee attendance data');
            alert('Error: No data found for the provided employee ID');
          }
        },
        (error) => {
          console.error('Error fetching employee attendance data:', error);
        }
      );
    } else {
      alert('Please enter an employee ID');
    }
  }
  
  evaluateData() {
    // Calculate the total number of days accounted for in the attendance data
    const totalDays = this.presentCount + this.absentCount + this.lateCount;
  
    // Calculate the attendance rate as a percentage
    const attendanceRate = (this.presentCount / totalDays) * 100;
  
    // Store the attendance rate in the evaluation message with two decimal precision
    this.evaluations = `Employee Attendance Rate: ${attendanceRate.toFixed(2)}%`;
  
    // Evaluate the attendance and provide a recommendation based on the rate
    if (attendanceRate < 75) {
      this.evaluations += `\nAttendance Rate is below the expected threshold of 75%. It's important to address the attendance issues. Consider discussing with the employee to understand the reasons for the frequent absences or tardiness.`;
    } else if (attendanceRate >= 75 && attendanceRate < 90) {
      this.evaluations += `\nAttendance Rate is below ideal performance. While the employee has been present most of the time, there is room for improvement in punctuality and consistent attendance. Consider offering coaching or support to help the employee improve.`;
    } else {
      this.evaluations += `\nExcellent attendance rate! The employee has been consistently present and on time, demonstrating a strong commitment to their work.`;
    }
  
    // Calculate additional factors for deeper analysis (e.g., late count)
    const latePercentage = (this.lateCount / totalDays) * 100;
    if (latePercentage > 10) {
      this.evaluations += `\nLate arrivals account for over 10% of the total attendance, which could impact overall productivity. It is recommended to address the lateness with the employee to ensure punctuality.`;
    }
  }
  
  generateReportBasedOnType() {
    switch (this.reportType) {
      case 'summary':
        this.generateSummaryReport();
        break;
      case 'dataInterpretation':
        this.generateDataInterpretationReport();
        break;
      case 'all':
        this.generateAllReport();
        break;
      default:
        this.evaluations += '\nInvalid report type selected. Please choose a valid report type.';
    }
  }
  
  generateSummaryReport() {
    // Generate a concise summary of the employee's attendance
    this.evaluations += `\nSummary Report:\nTotal Present: ${this.presentCount}, Total Absent: ${this.absentCount}, Total Late: ${this.lateCount}`;
  
    // Provide insights based on the numbers
    const totalDays = this.presentCount + this.absentCount + this.lateCount;
    const attendanceRate = (this.presentCount / totalDays) * 100;
    if (attendanceRate < 75) {
      this.evaluations += `\nNote: The attendance rate is below the expected 75% threshold, indicating potential attendance issues.`;
    } else {
      this.evaluations += `\nThe attendance rate is within the acceptable range. However, ongoing monitoring is recommended to ensure consistency.`;
    }
  }
  
  generateDataInterpretationReport() {
    // Provide an in-depth interpretation of the attendance data
    this.evaluations += `\nData Interpretation Report:\n`;
    this.evaluations += `The data shows that the employee was present ${this.presentCount} days, absent ${this.absentCount} days, and late ${this.lateCount} days. This information is crucial to understanding the employee's work habits and reliability.\n`;
  
    // Offer an interpretation based on trends
    const totalDays = this.presentCount + this.absentCount + this.lateCount;
    const attendanceRate = (this.presentCount / totalDays) * 100;
    const latePercentage = (this.lateCount / totalDays) * 100;
  
    if (attendanceRate < 75) {
      this.evaluations += `\nInterpretation: The employee's attendance is significantly below the expected standard, with an attendance rate of ${attendanceRate.toFixed(2)}%. The late arrivals and absences are contributing to this low rate. Further investigation is necessary to understand the reasons and take corrective actions.`;
    } else if (attendanceRate >= 75 && attendanceRate < 90) {
      this.evaluations += `\nInterpretation: While the attendance rate is slightly above the minimum standard, late arrivals are still a concern. The employee may benefit from a discussion to identify potential barriers to punctuality or consistency.`;
    } else {
      this.evaluations += `\nInterpretation: The employee demonstrates exemplary attendance with a rate above 90%, indicating strong reliability and work ethic. This employee is a positive role model in terms of punctuality and attendance.`;
    }
  
    // Late percentage interpretation
    if (latePercentage > 10) {
      this.evaluations += `\nNote: Lateness constitutes ${latePercentage.toFixed(2)}% of the attendance, which is considered high and could affect overall performance. Addressing the reasons behind the tardiness could improve productivity.`;
    }
  }
  
  generateAllReport() {
    // Generate the most comprehensive report
    this.evaluations += `\nAll Report:\nAttendance records from the entire period are displayed, including a summary of work hours and attendance behaviors.\n`;
  
    // Calculate and provide total hours worked
    this.evaluations += `\nTotal Hours Worked: ${this.totalHours}\n`;
  
    // Offer insights based on the total work hours and attendance patterns
    if (this.totalHours < 160) {
      this.evaluations += `\nNote: The total hours worked is below the expected threshold of 160 hours per month, which could indicate issues with absenteeism or tardiness. Further evaluation of attendance patterns may be needed.`;
    } else {
      this.evaluations += `\nThe total hours worked meets the expected standards, reflecting an adequate level of commitment and productivity.`;
    }
  
    // Add more detailed evaluation for any specific trends (e.g., high absenteeism)
    if (this.absentCount > this.presentCount) {
      this.evaluations += `\nWarning: Absences have outpaced attendance, indicating a potential problem with employee reliability. Immediate attention is recommended.`;
    }
  
    // Additional report interpretation
    this.evaluations += `\nFinal Thoughts: Based on the collected data, further steps should be taken to address attendance concerns. Employees with poor attendance may need counseling or other interventions to improve their commitment to their role.`;
  }
  
  fetchAttendanceData(): void {
    this.dashboardService.getTodayAttendance().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.attendanceData = response.data;
          this.filteredAttendance = [...this.attendanceData]; // Copy initial data
          this.filterAttendance(); // Apply the initial filter (if any)
        }
      },
      error: (error) => {
        console.error('Error fetching attendance data:', error);
      },
    });
  }
  
  

  // Method to open the modal
  openModal1(): void {
    this.modalVisible3 = true;
  }

  // Method to close the modal
  closeModal3(): void {
    this.modalVisible3 = false;
  }
  

  filterAttendance(): void {
    const query = this.searchQuery.toLowerCase();
    
    this.filteredAttendance = this.attendanceData.filter((record) => {
      // Apply search filter
      const matchesSearch =
        !query ||
        record.first_name.toLowerCase().includes(query) ||
        record.last_name.toLowerCase().includes(query) ||
        record.position.toLowerCase().includes(query);
  
      // Apply attendance status filter
      const matchesFilter =
        !this.attendanceFilter || record.status === this.attendanceFilter;
  
      // Only include records that match both filters
      return matchesSearch && matchesFilter;
    });
  }
  
  
  

  printAttendance(): void {
    const printContent = `
      <html>
        <head>
          <title>Attendance</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f4f4f4;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
          </style>
        </head>
        <body>
          <h1>Today's Attendance</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours Worked</th>
                <th>Undertime</th>
                <th>Overtime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredAttendance
                .map(record => `
                  <tr>
                    <td>${record.first_name} ${record.last_name}</td>
                    <td>${record.company}</td>
                    <td>${record.clock_in_time || 'N/A'}</td>
                    <td>${record.clock_out_time || 'N/A'}</td>
                    <td>${record.hours_worked || '0'}</td>
                    <td>${record.undertime || '0'}</td>
                    <td>${record.overtime || '0'}</td>
                    <td>${record.status}</td>
                  </tr>
                `)
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
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

  // Analyze current state
  if (pendingRequests > approvedRequests && pendingRequests > rejectedRequests) {
    requestExplanation += " There are many requests still pending. Consider reviewing them soon to avoid backlog.";
  } else if (approvedRequests > rejectedRequests) {
    requestExplanation += " Most requests are being approved, indicating that the process is running smoothly. This is a positive trend, but continued monitoring is recommended.";
  } else {
    requestExplanation += " A significant number of requests are being rejected, which may need further attention. This could indicate issues with the request process or criteria that need to be revisited.";
  }

  // Conclusion and actionable insights
  requestExplanation += `\n\nConclusion: To ensure smoother operations, a more proactive approach may be needed in addressing pending requests. Additionally, it may be helpful to analyze the reasons behind rejections and refine the approval criteria or process for better efficiency.`;

  this.requestReport = requestExplanation; // Set the dynamic report for requests
}

generateAttendanceReport() {
  const { present, absent, late } = this.attendanceSummary;
  
  let attendanceExplanation = `The attendance summary for the latest period shows:
  - Present: ${present} employees
  - Absent: ${absent} employees
  - Late: ${late} employees.`;

  // Analyze current state
  if (present > absent && present > late) {
    attendanceExplanation += " Overall, the attendance is good, with most employees present on time. This reflects positively on team engagement and punctuality.";
  } else if (late > absent) {
    attendanceExplanation += " There seems to be a significant number of late arrivals. Addressing punctuality through reminders or incentives could be beneficial.";
  } else {
    attendanceExplanation += " A considerable number of employees were absent. This might need further investigation to understand the root causes and improve attendance.";
  }

  // Conclusion and actionable insights
  attendanceExplanation += `\n\nConclusion: While attendance is generally positive, addressing the issue of late arrivals can help improve overall team productivity. It may also be beneficial to understand if the absenteeism is due to specific patterns, such as certain days of the week or health-related issues, and act accordingly.`;

  this.attendanceReport = attendanceExplanation; // Set the dynamic report
}

  
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

  // Analyze balance in distribution
  if (this.employeesByPosition.length > 1) {
    distributionExplanation += " There is a balanced distribution of employees across different positions, suggesting a diversified skill set within the workforce.";
  } else {
    distributionExplanation += " The company may benefit from a more diverse set of positions or roles to ensure operational flexibility and growth potential.";
  }

  // Conclusion and actionable insights
  distributionExplanation += `\n\nConclusion: If the distribution is skewed, there may be an opportunity to develop underrepresented positions or roles, ensuring the organization can adapt to changing needs or scale effectively. On the other hand, balanced distribution suggests a well-structured organization with a good spread of skills across roles.`;

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

  // Function to print the employee list
  printEmployeeList(): void {
    const printContents = document.querySelector('.modal-content')?.innerHTML || '';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Employee List</title>
            <style>
              /* Add your print-specific styles here */
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
  const margin = 10;
  let currentY = margin + 10; // Start position for the content

  // Set title style
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('HR Dashboard Automatic Report', margin, currentY);
  currentY += 20;

  // Add Automatic Reports Section Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Automatic Reports', margin, currentY);
  currentY += 15;

  // Function to handle report content
  const addReportSection = (title: string, text: string) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(title, margin, currentY);
    currentY += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    this.addTextToPDF(pdf, text, margin, currentY);
    currentY += this.calculateTextHeight(text) + 20;
  };

  // Add Attendance Report Summary
  addReportSection('Attendance Report Summary', this.attendanceReport);

  // Add Employee Distribution Report Summary
  addReportSection('Employee Distribution Report Summary', this.employeeDistributionReport);

  // Add Request Report Summary
  addReportSection('Request Report Summary', this.requestReport);

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

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    table-layout: fixed;
  }
  table, th, td {
    border: 1px solid #ddd;
  }
  th, td {
    padding: 10px;
    text-align: left;
    word-wrap: break-word;
  }
  th {
    background-color: #007bff;
    color: white;
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

    /* Ensure header only appears once on the first page */
    .header {
      page-break-before: always;
    }

    .footer {
      margin-top: 30px;
    }

    table {
      font-size: 12px;
      page-break-inside: avoid;
    }

    /* Force page break between sections */
    .automatic-report-section,
    .report-summary {
      page-break-after: always;
    }

    /* Prevent content from getting cut off */
    .content {
      max-width: 100%;
    }

    /* Add space between sections */
    .report-summary {
      margin-bottom: 20px;
    }

    /* Handle tables overflowing */
    .table-wrapper {
      page-break-inside: avoid;
      overflow: hidden;
    }

    .chart-section {
      page-break-before: always;
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

            <!-- Attendance Report Table -->
            <div class="report-summary">
              <h4>Attendance Report Summary</h4>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Present</td>
                    <td>${this.attendanceSummary.present}</td>
                  </tr>
                  <tr>
                    <td>Absent</td>
                    <td>${this.attendanceSummary.absent}</td>
                  </tr>
                  <tr>
                    <td>Late</td>
                    <td>${this.attendanceSummary.late}</td>
                  </tr>
                </tbody>
              </table>
              <p>${this.attendanceReport}</p>
            </div>

            <!-- Employee Distribution Report Table -->
            <div class="report-summary">
              <h4>Employee Distribution Report Summary</h4>
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Employee Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.employeesByPosition.map(entry => `
                    <tr>
                      <td>${entry.company}</td>
                      <td>${entry.employee_count}</td>
                      <td>${((entry.employee_count / this.totalEmployees) * 100).toFixed(2)}%</td>
                    </tr>`).join('')}
                </tbody>
              </table>
              <p>${this.employeeDistributionReport}</p>
            </div>

            <!-- Request Report Table -->
            <div class="report-summary">
              <h4>Request Report Summary</h4>
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pending</td>
                    <td>${this.pendingRequests}</td>
                  </tr>
                  <tr>
                    <td>Approved</td>
                    <td>${this.approvedRequests}</td>
                  </tr>
                  <tr>
                    <td>Rejected</td>
                    <td>${this.rejectedRequests}</td>
                  </tr>
                </tbody>
              </table>
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


 // Function to close the modal
  closeEmployeeModal(): void {
    this.modalVisible = false;
  }

  
}
