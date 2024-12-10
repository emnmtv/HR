import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-employeecalendar',
  templateUrl: './employeecalendar.component.html',
  styleUrls: ['./employeecalendar.component.scss']
})
export class EmployeecalendarComponent {
  employees = [
    { id: 1, name: 'Emily Anderson', department: 'UI/UX Design', attendance: 96, punctuality: 84, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Joan Pourhit', department: 'Software Engineering', attendance: 99, punctuality: 94, image: 'https://via.placeholder.com/150' },
  ];

  isModalOpen = false;
  selectedEmployee: any = null;
  calendarDays: any[][] = [];

  openCalendar(employee: any): void {
    this.selectedEmployee = employee;
    this.generateCalendar();
    this.isModalOpen = true;
  }

  closeCalendar(): void {
    this.selectedEmployee = null;
    this.isModalOpen = false;
  }

  generateCalendar(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = 30; // Fixed 30 days
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 6 for Saturday

    this.calendarDays = [];
    let week: any[] = [];

    // Add empty days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push({ date: null, status: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, status: null });
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    // Add empty days to fill the last week
    if (week.length) {
      while (week.length < 7) {
        week.push({ date: null, status: null });
      }
      this.calendarDays.push(week);
    }
  }

  markAttendance(day: any, status: string): void {
    if (day.date) {
      day.status = status;
      if (status === 'Present') {
        day.mark = '✓'; // Add a checkmark for Present
      } else if (status === 'Absent') {
        day.mark = 'X'; // Add an X for Absent
      }
    }
  }
}