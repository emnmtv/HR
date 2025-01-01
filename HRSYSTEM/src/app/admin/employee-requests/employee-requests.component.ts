import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-requests',
  templateUrl: './employee-requests.component.html',
  styleUrls: ['./employee-requests.component.scss']
})
export class EmployeeRequestsComponent {
  requests = [
    {
      name: 'Emily Gutierrez',
      company: 'bagger',
      type: 'Alteration',
      date: 'July 22, 2019',
      requestedDate: 'July 19, 2019',
      current: '05:30 - 14:34',
      new: '04:30 - 13:34',
      status: 'Pending',
      updatedBy: '',
      updatedDate: ''
    },
    {
      name: 'Diana Medina',
      company: 'bagger',
      type: 'Alteration',
      date: 'July 22, 2019',
      requestedDate: 'July 19, 2019',
      current: '14:21 - 22:38',
      new: '13:30 - 22:30',
      status: 'Pending',
      updatedBy: '',
      updatedDate: ''
    },
    // Add more data here...
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
