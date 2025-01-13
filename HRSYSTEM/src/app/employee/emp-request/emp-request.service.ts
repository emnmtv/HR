import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpRequestService {
  private apiUrl = 'http://localhost/integapi/main/routes.php'; // API endpoint

  constructor(private http: HttpClient) {}

  getEmployeeRequests(employeeId: number): Observable<any> {
    const body = {
      route: 'fetchUserRequest',
      employee_id: employeeId
    };
    return this.http.post<any>(this.apiUrl, body);
  }

     // Method to fetch messages using GET
  getMessages(employeeId: number): Observable<any> {
    const url = `${this.apiUrl}?route=fetchMessages&employee_id=${employeeId}`;
    return this.http.get<any>(url);
  }

  
  createRequest(employeeId: number, date: string, type: string, reason: string): Observable<any> {
    const body = {
      route: 'createRequest',
      employee_id: employeeId,
      date: date,
      type: type,
      reason: reason
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
