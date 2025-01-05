import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRecordService {

  private apiUrl = 'http://localhost/integapi/main/routes.php';  // Adjust if necessary

  constructor(private http: HttpClient) { }

  // Get employee data from PHP backend
  getEmployeeData(filters: any = {}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: filters
    };
    return this.http.get<any>(this.apiUrl + '?route=getEmployeeData', httpOptions);
  }

  registerEmployee(employee: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
    // Send the employee data directly without wrapping it in employeeData
    const body = {
      route: 'createEmployeeAccount',  // Route for the registration process in PHP
      ...employee  // Spread operator to send the employee data directly
    };
  
    return this.http.post<any>(this.apiUrl, body, httpOptions);
  }
  
}
