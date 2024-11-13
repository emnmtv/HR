import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component'; // Import LogInComponent

const routes: Routes = [
  { path: 'login', component: LogInComponent }, // Add this route for the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Optional: Redirect to login as the default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
