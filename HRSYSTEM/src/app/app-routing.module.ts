import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component'; // Import LogInComponent
import { SidenavComponent } from './sidenav/sidenav.component'; // Import SidenavComponent
import { AdminProfileComponent } from './employee/adminprofile/adminprofile.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EmployeecalendarComponent } from './admin/employeecalendar/employeecalendar.component';
import { DtrComponent } from './employee/dtr/dtr.component';
import { EmployeeRequestsComponent } from './admin/employee-requests/employee-requests.component';
import { EmployeeTabComponent } from './admin/employee-tab/employee-tab.component';
import { AdminSalaryComponent } from './admin/admin-salary/admin-salary.component';
import { DayattendancesummaryComponent } from './admin/dayattendancesummary/dayattendancesummary.component';
import { EmpRequestComponent } from './employee/emp-request/emp-request.component';
import { RecordsComponent } from './admin/records/records.component';
import { DtrSummaryComponent } from './employee/dtr-summary/dtr-summary.component';
import { AttendanceComponent } from './admin/attendance/attendance.component';
import { EmployeeDashboardComponent } from './employee/employee-dashboard/employee-dashboard.component';
import { MedicalComponent } from './admin/medical/medical.component';

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch: 'full' },
{ path: 'login', component: LogInComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: RecordsComponent },
  { path: 'sidenav', component: SidenavComponent },
  { path :'adminprofile', component: AdminProfileComponent},
  { path: 'employeecalendar', component: EmployeecalendarComponent},
  { path: 'dtr', component: DtrComponent},
  { path: 'emp', component: EmployeeRequestsComponent},
  { path: 'ep', component: EmployeeTabComponent},
  { path: 'ed', component: AdminSalaryComponent},
  { path: 'day', component: DayattendancesummaryComponent},
  { path: 'request', component: EmpRequestComponent},
  { path: 'summary', component: DtrSummaryComponent},
  { path: 'attendance', component: AttendanceComponent},
  { path: 'employeedash', component: EmployeeDashboardComponent},
  { path: 'med', component: MedicalComponent},
  { path: '**', component: ErrorComponent}, // Add this route for the login page
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
