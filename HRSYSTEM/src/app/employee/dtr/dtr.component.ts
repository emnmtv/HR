import { Component, OnInit } from '@angular/core';
import { DtrService } from './dtr.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-dtr',
  templateUrl: './dtr.component.html',
  styleUrls: ['./dtr.component.scss']
})
export class DtrComponent implements OnInit {
  dtrRecords: any[] = [];
  currentTime: string = '';
  currentDate: string = '';
  chart: any;
  constructor(private dtrService: DtrService) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadRecords();
    this.ensureTodayRecord();
    
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
      alert('You have already clocked in and out for today!');
      return;
    }

    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) {
      alert('Employee ID is missing!');
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
            alert('Clock-in successful!');
          } else {
            alert(response.message);
          }
        },
        (error) => {
          console.error('Clock-in error:', error);
          alert('Clock-in failed!');
        }
      );
    } else if (!record.clockOut) {
      this.dtrService.clockOut(payload).subscribe(
        (response) => {
          if (response.status === 'success') {
            record.clockOut = this.currentTime;
            this.calculateTimes(record);
            this.saveRecords();
            alert('Clock-out successful!');
          } else {
            alert(response.message);
          }
        },
        (error) => {
          console.error('Clock-out error:', error);
          alert('Clock-out failed!');
        }
      );
    }
  }
  ngAfterViewInit() {
    this.initChart();
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
  initChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5'], // Fake dates for demonstration
        datasets: [{
          label: 'Work Hours',
          data: [8, 7, 6, 8, 7], // Fake data for daily work hours
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
