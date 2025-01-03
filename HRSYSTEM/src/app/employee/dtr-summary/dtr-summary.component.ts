import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dtr-summary',
  templateUrl: './dtr-summary.component.html',
  styleUrls: ['./dtr-summary.component.scss']
})
export class DtrSummaryComponent implements OnInit {
  // Summary data
  summary = {
    late: '00:00:00',
    undertime: '00:41:49',
    nightDiff: '103:16:31',
    unpaidLeave: '0 day/s',
    specialHoliday: '00:00:00'
  };

  // Daily time records
  dtrRecords = [
    {
      date: '2025-01-01',
      status: 'Present',
      schedule: '08:00 AM - 05:00 PM',
      clockIn: '08:01 AM',
      clockOut: '05:00 PM',
      late: '00:01:00',
      undertime: '00:00:00',
      overtime: '00:00:00'
    },
    {
      date: '2025-01-02',
      status: 'Absent',
      schedule: '08:00 AM - 05:00 PM',
      clockIn: 'N/A',
      clockOut: 'N/A',
      late: 'N/A',
      undertime: 'N/A',
      overtime: 'N/A'
    },
    {
      date: '2025-01-03',
      status: 'Present',
      schedule: '09:00 AM - 06:00 PM',
      clockIn: '09:05 AM',
      clockOut: '06:00 PM',
      late: '00:05:00',
      undertime: '00:00:00',
      overtime: '00:30:00'
    }
    // Add more records as needed
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize or fetch data here if needed
  }

  // Method to handle "Details" button click
  onDetails(record: any): void {
    alert(`Details for ${record.date}:\nStatus: ${record.status}\nSchedule: ${record.schedule}`);
  }
}
