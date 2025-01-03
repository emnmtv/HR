import { Component, OnInit } from '@angular/core';
import { DtrService } from './dtr.service';

@Component({
  selector: 'app-dtr',
  templateUrl: './dtr.component.html',
  styleUrls: ['./dtr.component.scss']
})
export class DtrComponent implements OnInit {
  dtrRecords: any[] = [];
  currentTime: string = '';
  currentDate: string = '';
  showModal: boolean = false; // Modal visibility
  modalTitle: string = ''; // Modal title
  modalMessage: string = ''; // Modal message

  constructor(private dtrService: DtrService) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadRecords();
    this.ensureTodayRecord();
  }

  // Open the modal with a title and message
  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    this.currentDate = this.formatDate(now);
  }

  ensureTodayRecord() {
    const today = this.formatDate(new Date());
    const existingRecord = this.dtrRecords.find((record) => record.date === today);

    if (!existingRecord) {
      this.dtrRecords.unshift({
        date: today,
        status: 'Absent',
        schedule: '22:00 - 07:00',
        clockIn: '',
        clockOut: '',
        undertime: '',
        overtime: ''
      });
      this.saveRecords();
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  handleTimeInOut(record: any) {
    if (record.clockIn && record.clockOut) {
      this.openModal('Action Denied', 'You have already clocked in and out for today!');
      return;
    }

    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      this.openModal('Error', 'Employee ID is missing!');
      return;
    }

    const payload = {
      employee_id: +employeeId,
      date: record.date,
      time: this.currentTime
    };

    if (!record.clockIn) {
      this.dtrService.clockIn(payload).subscribe(
        (response) => {
          if (response.status === 'success') {
            record.clockIn = this.currentTime;
            record.status = 'Present';
            this.saveRecords();
            this.openModal('Success', 'Time-in successful!');
          } else {
            this.openModal('Error', response.message);
          }
        },
        (error) => {
          console.error('Clock-in error:', error);
          this.openModal('Error', 'Time-in failed!');
        }
      );
    } else if (!record.clockOut) {
      this.dtrService.clockOut(payload).subscribe(
        (response) => {
          if (response.status === 'success') {
            record.clockOut = this.currentTime;
            this.calculateTimes(record);
            this.saveRecords();
            this.openModal('Success', 'Time-out successful!');
          } else {
            this.openModal('Error', response.message);
          }
        },
        (error) => {
          console.error('Clock-out error:', error);
          this.openModal('Error', 'Time-out failed!');
        }
      );
    }
  }

  calculateTimes(record: any) {
    const [start, end] = record.schedule.split(' - ').map(this.parseTime);
    const clockInTime = this.parseTime(record.clockIn);
    const clockOutTime = this.parseTime(record.clockOut);

    const scheduledHours = end - start + (end < start ? 24 : 0);
    const workedHours = clockOutTime - clockInTime;

    if (workedHours < scheduledHours) {
      record.undertime = this.formatHours(scheduledHours - workedHours);
      record.overtime = '00:00';
    } else {
      record.overtime = this.formatHours(workedHours - scheduledHours);
      record.undertime = '00:00';
    }
  }

  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  loadRecords() {
    const storedRecords = localStorage.getItem('dtrRecords');
    this.dtrRecords = storedRecords ? JSON.parse(storedRecords) : [];
  }

  saveRecords() {
    localStorage.setItem('dtrRecords', JSON.stringify(this.dtrRecords));
  }
}
