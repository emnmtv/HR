import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './employees/employees.component';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SidenavComponent,
    ErrorComponent,
    EmployeesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Add FormsModule to the imports array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
