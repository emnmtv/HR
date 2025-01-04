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

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadEmployeeData();
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
      printWindow.document.write('<html><head><title>DTR History</title></head><body>');
      printWindow.document.write('<h3>' + this.selectedEmployee.name + "'s DTR History</h3>");
      printWindow.document.write('<table border="1" cellpadding="5"><thead><tr><th>Date</th><th>Time In</th><th>Time Out</th><th>Total Hours</th><th>Status</th></tr></thead><tbody>');
      
      this.selectedEmployee.dtrHistory.forEach((dtr: any) => {  // Explicitly defining 'dtr' as 'any'
        printWindow.document.write('<tr>');
        printWindow.document.write('<td>' + dtr.date + '</td>');
        printWindow.document.write('<td>' + dtr.timeIn + '</td>');
        printWindow.document.write('<td>' + dtr.timeOut + '</td>');
        printWindow.document.write('<td>' + dtr.totalHours + '</td>');
        printWindow.document.write('<td>' + dtr.status + '</td>');
        printWindow.document.write('</tr>');
      });
      
  
      printWindow.document.write('</tbody></table></body></html>');
      printWindow.document.close(); // Close the document to finish writing
      printWindow.print(); // Print the contents
    } else {
      console.error('Failed to open print window');
    }
  }
  
}
