import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employeecalendar',
  templateUrl: './employeecalendar.component.html',
  styleUrls: ['./employeecalendar.component.scss']
})
export class EmployeecalendarComponent implements OnInit {
  employees: any[] = [];
  isModalOpen = false;
  selectedEmployee: any = null;
  calendarDays: any[][] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    const apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeeData';
    this.http.get<{ status: string; data: any[] }>(apiUrl).subscribe(
      (response) => {
        if (response.status === 'success') {
          // Filter employees with `account_type` === 'Employee'
          this.employees = response.data
            .filter((emp) => emp.account_type === 'Employee')
            .map((emp) => ({
              id: emp.id,
              name: `${emp.first_name} ${emp.last_name}`,
              department: emp.company || 'N/A',
              attendance: 0, // Placeholder until dynamic data is added
              punctuality: 0, // Placeholder
              image: 'https://via.placeholder.com/150', // Placeholder for now
              Date: new Date().toDateString(), // Today's date
              timeIn: null,
              timeOut: null,
            }));
        }
      },
      (error) => {
        console.error('Failed to fetch employees:', error);
      }
    );
  }

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
    const daysInMonth = new Date(year, month + 1, 0).getDate();
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
