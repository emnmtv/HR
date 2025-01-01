import { Component } from '@angular/core';

@Component({
  selector: 'app-dtr',
  templateUrl: './dtr.component.html',
  styleUrls: ['./dtr.component.scss']
})
export class DtrComponent {
  dtrRecords = [
    {
      date: 'Sept 19',
      status: 'Present',
      schedule: '22:00 - 07:00',
      clockIn: '22:42:09',
      clockOut: '07:00:32',
      late: '00:00:00',
      undertime: '00:41:37',
      nightDiff: '07:17:51',
      overtime: '00:00:00'
    },
    // Add more records here
  ];
}
