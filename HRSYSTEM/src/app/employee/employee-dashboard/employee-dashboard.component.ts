import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
interface SalaryRecord {
  employee_id: number;
  final_salary: number;
  // Add any other properties that might be part of the salary data
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
})
export class EmployeeDashboardComponent implements OnInit, AfterViewInit {
  totalEmployees: number = 0;
  pendingRequests: number = 0;
  approvedRequests: number = 0;
  rejectedRequests: number = 0;
  employeeDistributionChart: Chart | null = null;
  reportGenerated: boolean = false; // Track if report is generated
  attendanceSummary = { present: 0, absent: 0, late: 0 };
  employeesByPosition: any[] = []; // This will hold the filtered employee data
  salaryDetails: any[] = []; // Store fetched salary details
  salaryChart: Chart | null = null;
  workedHoursDetails: any[] = [];  // Store worked hours details
  workedHoursChart: Chart | null = null; // Store worked hours chart instance
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchEmployeeData(); // Fetch employee data on init
    this.fetchSalaryDetails();
    this.fetchWorkedHours(); // Fetch worked hours on init
  }
  
  // Fetch worked hours data
  fetchWorkedHours() {
    this.dashboardService.getAllEmployeeWorkedHours().subscribe((response) => {
      if (response.status === 'success') {
        this.workedHoursDetails = response.data;
        this.renderWorkedHoursChart();
      } else {
        console.error('Failed to fetch worked hours:', response.message);
      }
    });
  }

  
  // Method to render the worked hours chart
  renderWorkedHoursChart() {
    const ctx = document.getElementById('workedHoursChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Worked Hours Chart element not found');
      return;
    }

    // Destroy the existing chart if it exists
    if (this.workedHoursChart) {
      this.workedHoursChart.destroy();
    }

    // Filter worked hours data based on employee_id from localStorage
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      console.error('Employee ID not found in local storage.');
      return;
    }

    const filteredWorkedHours = this.workedHoursDetails.filter(
      (workedHours: any) => workedHours.employee_id === parseInt(employeeId, 10)
    );

    if (filteredWorkedHours.length > 0) {
      const labels = filteredWorkedHours.map((record: any) => `Emp: ${record.employee_id}`);
      const workedHours = filteredWorkedHours.map((record: any) => record.worked_hours);

      // Create the line chart for worked hours
      this.workedHoursChart = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
          labels,
          datasets: [
            {
              label: 'Worked Hours',
              data: workedHours,
              borderColor: '#2196f3', // Line color
              backgroundColor: 'rgba(33, 150, 243, 0.2)', // Fill color
              borderWidth: 2,  // Line thickness
              fill: true,  // Fill the area under the line
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('No worked hours data found for the employee.');
    }
  }
  fetchSalaryDetails() {
    this.dashboardService.getAllEmployeeSalaryDetails().subscribe((response) => {
      if (response.status === 'success') {
        this.salaryDetails = response.data;
        this.renderSalaryChart();
      } else {
        console.error('Failed to fetch salary details:', response.message);
      }
    });
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

    // Render employee chart after view init
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
    const employeeId = localStorage.getItem('employee_id'); // Retrieve employee ID from local storage
  
    if (!employeeId) {
      console.error('Employee ID not found in local storage.');
      return;
    }
  
    this.dashboardService.getEmployeesPerCompany().subscribe((response) => {
      if (response.status === 'success') {
        // Filter employees based on the employee_id from local storage
        this.employeesByPosition = response.data.filter((employee: any) => employee.id === parseInt(employeeId, 10));
        console.log('Filtered Employees:', this.employeesByPosition);
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
  
    // Filter attendance data based on employee_id from localStorage
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      console.error('Employee ID not found in local storage.');
      return;
    }
  
    // Assuming response.data is an array of employee attendance records, filter for the specific employee
    this.dashboardService.getAttendanceData().subscribe((response) => {
      if (response.status === 'success') {
        // Filter attendance data for the specific employee
        const filteredAttendance = response.data.filter(
          (attendance: any) => attendance.employee_id === parseInt(employeeId, 10)
        );
  
        if (filteredAttendance.length > 0) {
          // Use filtered data to create the chart
          const present = filteredAttendance[0].present || 0;
          const absent = filteredAttendance[0].absent || 0;
          const late = filteredAttendance[0].late || 0;
  
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Present', 'Absent', 'Late'],
              datasets: [
                {
                  data: [present, absent, late],
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
        } else {
          console.error('No attendance data found for the employee.');
        }
      }
    });
  }

  renderSalaryChart() {
    const ctx = document.getElementById('salaryChart') as HTMLCanvasElement;
  
    if (!ctx) {
      console.error('Salary Chart element not found');
      return;
    }
  
    // Destroy the existing chart instance if it exists
    if (this.salaryChart) {
      this.salaryChart.destroy();
    }
  
    // Filter salary details based on employee_id from localStorage
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      console.error('Employee ID not found in local storage.');
      return;
    }
  
    this.dashboardService.getAllEmployeeSalaryDetails().subscribe((response) => {
      if (response.status === 'success') {
        // Filter salary data for the specific employee
        const filteredSalary = response.data.filter(
          (salary: SalaryRecord) => salary.employee_id === parseInt(employeeId, 10)
        );
  
        if (filteredSalary.length > 0) {
          // Prepare data for the chart
          const labels = filteredSalary.map((record: SalaryRecord) => `Emp: ${record.employee_id}`);
          const salaries = filteredSalary.map((record: SalaryRecord) => record.final_salary);
  
          // Create the salary chart as a line chart
          this.salaryChart = new Chart(ctx, {
            type: 'line',  // Changed to 'line' for a line chart
            data: {
              labels,
              datasets: [
                {
                  label: 'Final Salary',
                  data: salaries,
                  borderColor: '#4caf50',  // Line color
                  backgroundColor: 'rgba(76, 175, 80, 0.2)', // Line fill color
                  borderWidth: 2,  // Line thickness
                  fill: true,  // Fill the area under the line
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
              scales: {
                y: {
                  beginAtZero: true, // Ensure the y-axis starts at zero
                },
              },
            },
          });
        } else {
          console.error('No salary data found for the employee.');
        }
      } else {
        console.error('Failed to fetch salary details:', response.message);
      }
    });
  }
  
  // Method to generate a PDF report of the dashboard
  generateReport() {
    const content = document.getElementById('dashboardReport');

    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();

        doc.addImage(imgData, 'PNG', 10, 10, 180, 160);
        doc.save('employee-dashboard-report.pdf');
        this.reportGenerated = true;
      });
    } else {
      console.error('Report content not found');
    }
  }
}
