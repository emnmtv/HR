import { Component, OnInit } from '@angular/core'; 
import { AttendanceService } from './attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: any[] = [];
  selectedEmployee: any = null;
  searchTerm: string = ''; // Variable for search term
  
  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  // Method to filter records based on the search term
  filteredAttendanceRecords() {
    if (!this.searchTerm) return this.attendanceRecords;

    const term = this.searchTerm.toLowerCase();
    return this.attendanceRecords.filter(
      (record) =>
        record.id.toString().includes(term) ||
        record.name.toLowerCase().includes(term)
    );
  }

  // Method to load employee data from the backend
  loadEmployeeData() {
    this.attendanceService.getEmployeeData().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.attendanceRecords = response.data.map((employee: any) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            company: employee.company,
            date: '', // Placeholder
            timeIn: '', // Placeholder
            timeOut: '', // Placeholder
            totalHours: '', // Placeholder
            status: '', // Placeholder
            id: employee.id,
            email: employee.email
          }));
          this.loadTimeData(); // Load time-related data after employee data
        }
      },
      (error) => console.error('Failed to fetch employee data:', error)
    );
  }

  // Method to load time data for each employee
  loadTimeData() {
    this.attendanceRecords.forEach((record, index) => {
      this.attendanceService.getTimeInOut(record.id).subscribe(
        (response) => {
          if (response.status === 'success' && response.data.length > 0) {
            const timeData = response.data[0]; // Assuming we're using the first record
            this.attendanceRecords[index] = {
              ...record,
              date: timeData.date || '--',
              timeIn: timeData.clock_in_time || '--:--',
              timeOut: timeData.clock_out_time || '--:--',
              totalHours: timeData.hours_worked || '--', // Directly fetch hours worked
              undertime: timeData.undertime || '--', // Fetch undertime (if available)
              overtime: timeData.overtime || '--', // Fetch overtime (if available)
              status: timeData.status || 'Unknown'
            };
          }
        },
        (error) => console.error('Failed to fetch time data for employee:', error)
      );
    });
  }

  // Method to view DTR history for a selected employee
  viewDtrHistory(employeeId: number) {
    const employee = this.attendanceRecords.find((record) => record.id === employeeId);

    if (employee) {
      this.selectedEmployee = null; // Clear previous selection

      // Fetch DTR history for the selected employee
      this.attendanceService.getTimeInOut(employee.id).subscribe(
        (response) => {
          if (response.status === 'success' && response.data) {
            this.selectedEmployee = {
              ...employee,
              dtrHistory: response.data.map((dtr: any) => ({
                date: dtr.date || '--',
                timeIn: dtr.clock_in_time || '--:--',
                timeOut: dtr.clock_out_time || '--:--',
                totalHours: dtr.hours_worked || '--', // Directly fetch the hours worked
                undertime: dtr.undertime || '--', // Fetch the undertime
                overtime: dtr.overtime || '--', // Fetch the overtime
                status: dtr.status || 'Unknown'
              }))
            };
          } else {
            console.error('DTR history not found or empty:', response.message);
            this.selectedEmployee = { ...employee, dtrHistory: [] };
          }
        },
        (error) => {
          console.error('Error fetching DTR history:', error);
          this.selectedEmployee = { ...employee, dtrHistory: [] };
        }
      );
    } else {
      console.error('Employee not found with ID:', employeeId);
    }
  }

  // Method to close the modal displaying DTR history
  closeModal() {
    this.selectedEmployee = null;
  }

  // Method to refresh the attendance data
  refreshAttendance() {
    this.loadEmployeeData(); // Reload employee data
  }

  printDtrHistory() {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      const currentDate = new Date();
      const month = currentDate.toLocaleString('default', { month: 'long' });
      const dateStr = currentDate.toLocaleDateString();
      const timeStr = currentDate.toLocaleTimeString();
  
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DTR History</title>
          <style>
            /* General styles */
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
              color: #333;
              line-height: 1.6;
            }
  
            /* Header styles */
            .header {
              background-color: #2e7d32; /* Green top bar */
              color: white;
              padding: 10px 20px;
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
  
            /* Employee details styles (bigger and compressed) */
            .header-details {
              text-align: left;
              margin: 10px 0 0 20px;
              font-size: 18px; /* Bigger font */
              font-weight: ;
              line-height: 1.4;
            }
            .header-details p {
              margin: 2px 0; /* Compressed spacing between details */
            }
  
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 14px;
            }
            table th, table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            table th {
              background-color: #e0f2f7;
              font-weight: bold;
            }
            table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
  
            /* Footer styles */
            .footer {
              margin-top: 20px;
              font-size: 12px;
              text-align: left;
            }
            .signature {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              font-size: 14px;
            }
            .signature span {
              display: inline-block;
              width: 45%;
              border-top: 1px solid black;
              text-align: center;
              margin-top: 10px;
            }
  
            /* Print-specific styles */
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              table {
                border: 1px solid black;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>iMART Daily Time Record</h1>
          </div>
          <div class="header-details">
            <p><strong>Name:</strong> ${this.selectedEmployee.name}</p>
            <p><strong>Employee ID:</strong> ${this.selectedEmployee.id}</p>
            <p><strong>Email:</strong> ${this.selectedEmployee.email}</p>
            <p><strong>Position:</strong> ${this.selectedEmployee.company}</p>
            <p><strong>Month:</strong> ${month}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Total Hours</th>
                <th>Undertime</th>
                <th>Overtime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `);
  
      // Populate the table with DTR history
      if (this.selectedEmployee.dtrHistory && this.selectedEmployee.dtrHistory.length > 0) {
        this.selectedEmployee.dtrHistory.forEach((dtr: any) => {
          printWindow.document.write(`
            <tr>
              <td>${dtr.date}</td>
              <td>${dtr.timeIn}</td>
              <td>${dtr.timeOut}</td>
              <td>${dtr.totalHours}</td>
              <td>${dtr.undertime}</td>
              <td>${dtr.overtime}</td>
              <td>${dtr.status}</td>
            </tr>
          `);
        });
      } else {
        printWindow.document.write(`
          <tr>
            <td colspan="7">No records available</td>
          </tr>
        `);
      }
  
      printWindow.document.write(`
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${dateStr} at ${timeStr}</p>
            <p>&copy; iMART</p>
          </div>
          <div class="signature">
            <span>Admin Signature</span>
            <span>Employee Signature</span>
          </div>
        </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window. Check browser pop-up settings or permissions.');
    }
  }
  
  
  
}
