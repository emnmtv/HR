import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule for reactive forms
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for HTTP requests

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminProfileComponent } from './admin/adminprofile/adminprofile.component';
import { EmployeecalendarComponent } from './admin/employeecalendar/employeecalendar.component';
import { DtrComponent } from './employee/dtr/dtr.component';
import { EmployeeRequestsComponent } from './admin/employee-requests/employee-requests.component';
import { EmployeeTabComponent } from './admin/employee-tab/employee-tab.component';
import { AdminSalaryComponent } from './admin/admin-salary/admin-salary.component';
import { DayattendancesummaryComponent } from './admin/dayattendancesummary/dayattendancesummary.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SidenavComponent,
    ErrorComponent,
    EmployeesComponent,
    DashboardComponent,
    AdminProfileComponent,
    EmployeecalendarComponent,
    DtrComponent,
    EmployeeRequestsComponent,
    EmployeeTabComponent,
    AdminSalaryComponent,
    DayattendancesummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // For template-driven forms
    ReactiveFormsModule, // For reactive forms
    HttpClientModule, // For HTTP requests
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
