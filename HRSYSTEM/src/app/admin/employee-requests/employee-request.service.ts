import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRequestService {
  private apiUrl = 'http://localhost/integapi/main/routes.php';

  constructor(private http: HttpClient) {}

  // Get all employees
  getEmployeeData(): Observable<any> {
    const url = `${this.apiUrl}?route=getEmployeeData`;
    return this.http.get(url);
  }

  sendMessage(body: any): Observable<any> {
    const url = `${this.apiUrl}?route=sendMessage`;
    return this.http.post<any>(url, body);
  }
  
  // Fetch requests for a specific employee
  fetchUserRequests(employeeId: number): Observable<any> {
    const body = {
      route: 'fetchUserRequest',
      employee_id: employeeId
    };
    return this.http.post<any>(this.apiUrl, body);
  }

  // Update request status (approve/reject)
  updateRequestStatus(requestId: number, status: string, employeeId: number): Observable<any> {
    const body = {
      route: 'updateRequestStatus',
      request_id: requestId,
      status: status,
      employee_id: employeeId  // Added employee_id to the request body
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
