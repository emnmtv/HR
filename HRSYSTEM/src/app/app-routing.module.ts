import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component'; // Import LogInComponent
import { SidenavComponent } from './sidenav/sidenav.component'; // Import SidenavComponent
import { AdminProfileComponent } from './adminprofile/adminprofile.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './employees/employees.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeecalendarComponent } from './employeecalendar/employeecalendar.component';
import { DtrComponent } from './dtr/dtr.component';
import { EmployeeRequestsComponent } from './employee-requests/employee-requests.component';

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
  
  
  
  
  { path: '**', component: ErrorComponent}, // Add this route for the login page
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
