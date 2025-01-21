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
// Method to filter records
filteredAttendanceRecords() {
  if (!this.searchTerm) return this.attendanceRecords;

  const term = this.searchTerm.toLowerCase();
  return this.attendanceRecords.filter(
    (record) =>
      record.id.toString().includes(term) ||
      record.name.toLowerCase().includes(term)
  );
}
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
            id: employee.id
          }));
          this.loadTimeData();
        }
      },
      (error) => console.error('Failed to fetch employee data:', error)
    );
  }

  loadTimeData() {
    this.attendanceRecords.forEach((record, index) => {
      this.attendanceService.getTimeInOut(record.id).subscribe(
        (response) => {
          if (response.status === 'success' && response.data.length > 0) {
            const timeData = response.data[0];
            this.attendanceRecords[index] = {
              ...record,
              date: timeData.date || '--',
              timeIn: timeData.clock_in_time || '--:--',
              timeOut: timeData.clock_out_time || '--:--',
              totalHours: this.calculateTotalHours(
                timeData.clock_in_time,
                timeData.clock_out_time
              ),
              status: timeData.status || 'Unknown'
            };
          }
        },
        (error) => console.error('Failed to fetch time data for employee:', error)
      );
    });
  }

  calculateTotalHours(timeIn: string, timeOut: string): string {
    if (!timeIn || !timeOut) return '--';
    const timeInDate = new Date(`1970-01-01T${timeIn}`);
    const timeOutDate = new Date(`1970-01-01T${timeOut}`);
    const diffMs = timeOutDate.getTime() - timeInDate.getTime();
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  }

  viewDtrHistory(employeeId: number) {
    const employee = this.attendanceRecords.find((record) => record.id === employeeId);

    if (employee) {
      // Clear the previous selection
      this.selectedEmployee = null;

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
                totalHours: this.calculateTotalHours(
                  dtr.clock_in_time,
                  dtr.clock_out_time
                ),
                status: dtr.status || 'Unknown'
              }))
            };
          } else {
            console.error('DTR history not found or empty:', response.message);
            this.selectedEmployee = {
              ...employee,
              dtrHistory: []
            };
          }
        },
        (error) => {
          console.error('Error fetching DTR history:', error);
          this.selectedEmployee = {
            ...employee,
            dtrHistory: []
          };
        }
      );
    } else {
      console.error('Employee not found with ID:', employeeId);
    }
  }

  closeModal() {
    this.selectedEmployee = null;
  }
  refreshAttendance() {
    this.loadEmployeeData();  // This will reload the employee data
  }
  

  printDtrHistory() {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) { // Ensure printWindow is not null
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DTR History</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #333;
            }
            .header h3 {
              margin: 5px 0;
              font-size: 20px;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            table th, table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            table th {
              background-color: #f4f4f4;
              font-weight: bold;
              color: #333;
            }
            table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            table tr:hover {
              background-color: #f1f1f1;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>iMART</h1>
            <h3>${this.selectedEmployee.name}'s DTR History</h3>
            <h3>Position:${this.selectedEmployee.company}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `);
  
      this.selectedEmployee.dtrHistory.forEach((dtr: any) => {
        printWindow.document.write(`
          <tr>
            <td>${dtr.date}</td>
            <td>${dtr.timeIn}</td>
            <td>${dtr.timeOut}</td>
            <td>${dtr.totalHours}</td>
            <td>${dtr.status}</td>
          </tr>
        `);
      });
  
      printWindow.document.write(`
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>&copy; iMART</p>
          </div>
        </body>
        </html>
      `);
  
      printWindow.document.close(); // Close the document to finish writing
      printWindow.print(); // Print the contents
    } else {
      console.error('Failed to open print window');
    }
  }
  
  
}
