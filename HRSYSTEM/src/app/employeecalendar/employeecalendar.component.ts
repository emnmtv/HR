import { Component } from '@angular/core';

@Component({
  selector: 'app-employeecalendar',
  templateUrl: './employeecalendar.component.html',
  styleUrls: ['./employeecalendar.component.scss']
})
export class EmployeecalendarComponent {
  employees = [
    { id: 1, name: 'Knowell Lucky Versoza', department: 'UI/UX Design', attendance: 96, punctuality: 84, image: 'https://via.placeholder.com/150', Date: "December 19, 2023", timeIn: "9:00 AM", timeOut: "6:00 PM" },
    { id: 2, name: 'Jush Eisley De Guzman', department: 'UI/UX Design', attendance: 96, punctuality: 84, image: 'https://via.placeholder.com/150', Date: "December 19, 2023", timeIn: "9:30 AM", timeOut: "5:30 PM" },
    { id: 3, name: 'John Mel Haniba', department: 'Software Engineering', attendance: 99, punctuality: 94, image: 'https://via.placeholder.com/150', Date: "December 19, 2023", timeIn: "8:00 AM", timeOut: "5:00 PM" },
    { id: 4, name: 'Jake Alan Legada', department: 'Fullstack Developer', attendance: 99, punctuality: 94, image: 'https://via.placeholder.com/150', Date: "December 19, 2023", timeIn: "8:00 AM", timeOut: "5:00 PM" },
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
    const daysInMonth = 30;
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    this.calendarDays = [];
    let week: any[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push({ date: null, timeIn: null, timeOut: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, timeIn: null, timeOut: null });
      if (week.length === 7) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    if (week.length) {
      while (week.length < 7) {
        week.push({ date: null, timeIn: null, timeOut: null });
      }
      this.calendarDays.push(week);
    }
  }

  recordTime(day: any, type: 'timeIn' | 'timeOut'): void {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (type === 'timeIn' && !day.timeIn) {
      day.timeIn = time;
    } else if (type === 'timeOut' && day.timeIn) {
      day.timeOut = time;
    }
  }
}