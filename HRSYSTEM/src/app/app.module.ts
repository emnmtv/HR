import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule for reactive forms
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for HTTP requests

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './employees/employees.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProfileComponent } from './adminprofile/adminprofile.component';
import { EmployeecalendarComponent } from './employeecalendar/employeecalendar.component';

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
