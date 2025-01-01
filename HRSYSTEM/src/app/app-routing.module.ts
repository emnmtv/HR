import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component'; // Import LogInComponent
import { SidenavComponent } from './sidenav/sidenav.component'; // Import SidenavComponent
import { AdminProfileComponent } from './admin/adminprofile/adminprofile.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EmployeecalendarComponent } from './admin/employeecalendar/employeecalendar.component';
import { DtrComponent } from './employee/dtr/dtr.component';
import { EmployeeRequestsComponent } from './admin/employee-requests/employee-requests.component';
import { EmployeeTabComponent } from './admin/employee-tab/employee-tab.component';
import { AdminSalaryComponent } from './admin/admin-salary/admin-salary.component';
import { DayattendancesummaryComponent } from './admin/dayattendancesummary/dayattendancesummary.component';

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch: 'full' },
{ path: 'login', component: LogInComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'sidenav', component: SidenavComponent },
  { path :'adminprofile', component: AdminProfileComponent},
  { path: 'employeecalendar', component: EmployeecalendarComponent},
  { path: 'dtr', component: DtrComponent},
  { path: 'emp', component: EmployeeRequestsComponent},
  { path: 'ep', component: EmployeeTabComponent},
  { path: 'ed', component: AdminSalaryComponent},
  { path: 'day', component: DayattendancesummaryComponent},
  { path: '**', component: ErrorComponent}, // Add this route for the login page
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
