import { Component } from '@angular/core';

@Component({
  selector: 'app-dayattendancesummary',
  templateUrl: './dayattendancesummary.component.html',
  styleUrl: './dayattendancesummary.component.scss'
})
export class DayattendancesummaryComponent {
  attendanceRecords = [
    {
      name: 'John Doe',
      status: 'Present',
      clockIn: '08:00 AM',
      clockOut: '05:00 PM',
      late: '00:15:00',
      overtime: '01:30:00'
    },
    {
      name: 'Jane Smith',
      status: 'Late',
      clockIn: '08:30 AM',
      clockOut: '05:00 PM',
      late: '00:30:00',
      overtime: '00:00:00'
    },
    {
      name: 'Mark Taylor',
      status: 'Absent',
      clockIn: '-',
      clockOut: '-',
      late: '-',
      overtime: '-'
    },
    // Add more records as needed
  ];
}
