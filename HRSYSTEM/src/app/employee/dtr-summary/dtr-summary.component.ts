import { Component, OnInit } from '@angular/core';
import { DtrSummaryService } from './dtr-summary.service'; // Ensure the service is correctly imported
import { Router } from '@angular/router';  // Import the router to redirect if not logged in

// Define the interface for DTR Record
interface DtrRecord {
  date: string;
  status: string;
  schedule: string;
  clockIn: string;
  clockOut: string;
  late: string;
  undertime: string;
  overtime: string;
}

@Component({
  selector: 'app-dtr-summary',
  templateUrl: './dtr-summary.component.html',
  styleUrls: ['./dtr-summary.component.scss']
})
export class DtrSummaryComponent implements OnInit {
  // Summary data (fixed)
  summary = {
    late: '00:00:00',
    undertime: '00:41:49',
    nightDiff: '103:16:31',
    unpaidLeave: '0 day/s',
    specialHoliday: '00:00:00'
  };
  showModal: boolean = false;

  // dtrRecords array typed as DtrRecord[]
  dtrRecords: DtrRecord[] = [];

  loggedInEmployeeId: number = 0; // Variable to store logged-in employee ID

  // Declare selectedRecord property to store the selected DTR record
  selectedRecord: DtrRecord | null = null;

  constructor(
    private dtrSummaryService: DtrSummaryService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the logged-in employee ID from local storage
    const storedEmployeeId = localStorage.getItem('employee_id');
    if (storedEmployeeId) {
      this.loggedInEmployeeId = parseInt(storedEmployeeId, 10);

      // Fetch the DTR data for the logged-in employee
      this.fetchDtrData(this.loggedInEmployeeId);
    } else {
      // Redirect to login page if no employee_id is found in local storage
      this.router.navigate(['/login']);
    }
  }

  fetchDtrData(employeeId: number): void {
    this.dtrSummaryService.getTimeInOut(employeeId).subscribe(
      response => {
        if (response.status === 'success') {
          this.dtrRecords = response.data.map((record: any) => {
            const clockInTime = new Date(record.clock_in_time);
            const clockInTimeString = clockInTime.toLocaleTimeString('en-US', { hour12: false });

            // Schedule start time for comparison (08:00 AM)
            const scheduleStartTime = '08:00:00';

            // Calculate late time if clock-in is after 8:00 AM
            const lateTime = this.calculateLate(clockInTimeString, scheduleStartTime);

            return {
              date: record.date,  // Use the date directly from the API response
              status: record.status, // Use the status directly from the API response
              schedule: '08:00 AM - 05:00 PM', // Example schedule, adjust as needed
              clockIn: record.clock_in_time,
              clockOut: record.clock_out_time,
              late: lateTime,  // Calculate late if needed
              undertime: '00:00:00', // Undertime calculation, if needed
              overtime: '00:00:00' // Overtime calculation, if needed
            };
          });
        } else {
          alert('Error fetching data: ' + response.message);
        }
      },
      error => {
        console.error('Error fetching DTR records:', error);
      }
    );
  }

  // Method to handle "Details" button click
  onDetails(record: DtrRecord): void {
    this.selectedRecord = record;  // Set the selected record
    this.showModal = true;         // Show the modal
  }

  // Method to close the modal
  closeModal(): void {
    this.showModal = false;        // Hide the modal
  }

  // Method to calculate late time based on clock-in time and schedule start time
  calculateLate(clockInTime: string, scheduleStartTime: string): string {
    const clockIn = this.convertToMinutes(clockInTime);
    const scheduleStart = this.convertToMinutes(scheduleStartTime);

    // If clock-in is after the scheduled start time, calculate the late time
    if (clockIn > scheduleStart) {
      const lateMinutes = clockIn - scheduleStart;
      return this.convertMinutesToTimeFormat(lateMinutes);
    }

    // If clock-in is on time or early, return '00:00:00'
    return '00:00:00';
  }

  // Helper function to convert time in HH:mm:ss format to minutes
  private convertToMinutes(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  // Helper function to convert minutes back to HH:mm:ss format
  private convertMinutesToTimeFormat(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes - Math.floor(minutes)) * 60);
    return `${this.padZero(hours)}:${this.padZero(mins)}:${this.padZero(secs)}`;
  }

  // Helper function to pad single digits with a leading zero
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
