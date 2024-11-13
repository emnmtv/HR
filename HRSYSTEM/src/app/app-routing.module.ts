import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component'; // Import LogInComponent
import { SidenavComponent } from './sidenav/sidenav.component'; // Import SidenavComponent

const routes: Routes = [
  { path: 'login', component: LogInComponent }, // Add this route for the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Optional: Redirect to login as the default route

  // Define other routes that might include the sidenav layout
  {
    path: 'dashboard', // Example of a route that might use sidenav
    component: SidenavComponent,
    children: [
      // You can define child routes under the dashboard here
      { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
