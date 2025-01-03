import { Component, OnInit } from '@angular/core';
import { DtrService } from './dtr.service';

@Component({
  selector: 'app-dtr',
  templateUrl: './dtr.component.html',
  styleUrls: ['./dtr.component.scss']
})
export class DtrComponent implements OnInit {
  dtrRecords = [
    {
      date: this.formatDate(new Date()),
      status: 'Present',
      schedule: '22:00 - 07:00',
      clockIn: '',
      clockOut: '',
      undertime: '',
      overtime: '',
    },
  ];
  currentTime: string = '';
  currentDate: string = '';
  showModal: boolean = false;
  selectedRecord: any = null;

  constructor(private dtrService: DtrService) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.checkCurrentDate();
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    this.currentDate = now.toDateString();
  }

  checkCurrentDate() {
    const today = this.formatDate(new Date());
    if (this.dtrRecords[0].date !== today) {
      this.dtrRecords.unshift({
        date: today,
        status: 'Absent',
        schedule: '22:00 - 07:00',
        clockIn: '',
        clockOut: '',
        undertime: '',
        overtime: '',
      });
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
  }

  toggleTimeInOut(record: any) {
    this.selectedRecord = record;
    this.showModal = true;
  }

  confirmTimeInOut() {
    const employeeId = +localStorage.getItem('employee_id')!; // Assuming employee ID is stored in local storage

    // Ensure the employee_id exists in localStorage and log it for debugging
    if (!employeeId) {
      alert('Employee ID is missing!');
      console.error('Employee ID is missing from localStorage');
      return;
    }

    console.log('Employee ID:', employeeId); // Debugging line

    if (!this.selectedRecord.clockIn) {
      this.dtrService.clockIn(employeeId).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.selectedRecord.clockIn = this.currentTime;
            this.selectedRecord.status = 'Present';
            alert('Clock-in successful');
            console.log(`Clock-in successful at: ${this.currentTime}`);
          } else {
            alert(response.message);
            console.log(`Clock-in failed: ${response.message}`);
          }
        },
        (error) => {
          console.error(error);
          console.log(`Clock-in error: ${error.message}`);
        }
      );
    } else {
      this.dtrService.clockOut(employeeId).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.selectedRecord.clockOut = this.currentTime;
            this.calculateTime(this.selectedRecord);
            alert('Clock-out successful');
            console.log(`Clock-out successful at: ${this.currentTime}`);
          } else {
            alert(response.message);
            console.log(`Clock-out failed: ${response.message}`);
          }
        },
        (error) => {
          console.error(error);
          console.log(`Clock-out error: ${error.message}`);
        }
      );
    }

    this.showModal = false;
    this.selectedRecord = null;
  }

  cancelTimeInOut() {
    this.showModal = false;
    this.selectedRecord = null;
  }

  calculateTime(record: any) {
    const schedule = record.schedule.split(' - '); // ['22:00', '07:00']
    const scheduleStart = this.parseTime(schedule[0]);
    const scheduleEnd = this.parseTime(schedule[1], true); // Handle overnight shifts

    const clockInTime = this.parseTime(record.clockIn);
    const clockOutTime = this.parseTime(record.clockOut);

    const scheduledDuration = scheduleEnd - scheduleStart; // In milliseconds
    const workedDuration = clockOutTime - clockInTime;

    if (workedDuration < scheduledDuration) {
      const undertime = scheduledDuration - workedDuration;
      record.undertime = this.formatDuration(undertime);
      record.overtime = '00:00:00';
    } else {
      const overtime = workedDuration - scheduledDuration;
      record.overtime = this.formatDuration(overtime);
      record.undertime = '00:00:00';
    }
  }

  parseTime(time: string, isNextDay: boolean = false): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let date = new Date();
    date.setHours(hours, minutes, seconds || 0);
    if (isNextDay) {
      date.setDate(date.getDate() + 1); // Add a day for overnight shifts
    }
    return date.getTime();
  }

  formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
