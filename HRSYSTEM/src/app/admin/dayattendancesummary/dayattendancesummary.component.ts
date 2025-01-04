import { Component, OnInit } from '@angular/core';
import { AttendanceService } from './attendance.service';

@Component({
  selector: 'app-dayattendancesummary',
  templateUrl: './dayattendancesummary.component.html',
  styleUrls: ['./dayattendancesummary.component.scss']
})
export class DayattendancesummaryComponent implements OnInit {
  attendanceRecords: any[] = [];
  dailySummary = {
    totalEmployees: 0,
    present: 0,
    late: 0,
    absent: 0,
    overtime: '00:00:00'
  };

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendanceSummary();
  }

  loadAttendanceSummary(): void {
    this.attendanceService.getEmployeeData().subscribe(
      (response) => {
        if (response && response.data) {
          const employees = response.data;
          this.dailySummary.totalEmployees = employees.length;

          employees.forEach((employee: any) => {
            this.attendanceService.getTimeInOut(employee.id).subscribe(
              (attendanceResponse) => {
                if (attendanceResponse && attendanceResponse.data) {
                  const latestRecord = attendanceResponse.data[0]; // Latest attendance record
                  const late = this.calculateLate(latestRecord.clock_in_time);
                  const overtime = this.calculateOvertime(latestRecord.clock_in_time, latestRecord.clock_out_time);

                  this.attendanceRecords.push({
                    name: `${employee.first_name} ${employee.last_name}`,
                    status: latestRecord.status || 'Unknown',
                    clockIn: latestRecord.clock_in_time || '--:--',
                    clockOut: latestRecord.clock_out_time || '--:--',
                    late: late || '00:00:00',
                    overtime: overtime || '00:00:00'
                  });

                  this.updateSummary(latestRecord.status, late, overtime);
                }
              },
              (error) => {
                console.error(`Error fetching time-in/out for employee ID ${employee.id}:`, error);
              }
            );
          });
        }
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  calculateLate(clockIn: string): string {
    const expectedTime = new Date('1970-01-01T08:00:00');
    const clockInTime = new Date(`1970-01-01T${clockIn || '00:00:00'}`);
    if (clockInTime > expectedTime) {
      const diff = clockInTime.getTime() - expectedTime.getTime();
      return new Date(diff).toISOString().substr(11, 8); // Returns HH:mm:ss
    }
    return '00:00:00';
  }

  calculateOvertime(clockIn: string, clockOut: string): string {
    const expectedOut = new Date('1970-01-01T17:00:00');
    const clockOutTime = new Date(`1970-01-01T${clockOut || '00:00:00'}`);
    if (clockOutTime > expectedOut) {
      const diff = clockOutTime.getTime() - expectedOut.getTime();
      return new Date(diff).toISOString().substr(11, 8);
    }
    return '00:00:00';
  }

  updateSummary(status: string, late: string, overtime: string): void {
    if (status === 'Present' || status === 'Late') {
      this.dailySummary.present++;
    } else if (status === 'Absent') {
      this.dailySummary.absent++;
    }

    if (status === 'Late') {
      this.dailySummary.late++;
    }

    const [hours, minutes, seconds] = this.dailySummary.overtime.split(':').map(Number);
    const [newHours, newMinutes, newSeconds] = overtime.split(':').map(Number);

    const totalSeconds = seconds + newSeconds;
    const totalMinutes = minutes + newMinutes + Math.floor(totalSeconds / 60);
    const totalHours = hours + newHours + Math.floor(totalMinutes / 60);

    this.dailySummary.overtime = `${String(totalHours).padStart(2, '0')}:${String(
      totalMinutes % 60
    ).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
  }
}
