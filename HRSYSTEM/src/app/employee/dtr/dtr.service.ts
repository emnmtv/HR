import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DtrService {
  private baseUrl = 'http://localhost/integapi/main/routes.php?route=';

  constructor(private http: HttpClient) {}

  clockIn(payload: { employee_id: number; date: string; time: string }): Observable<any> {
    const url = `${this.baseUrl}clockIn`;
    return this.http.post(url, payload);
  }

  clockOut(payload: { employee_id: number; date: string; time: string }): Observable<any> {
    const url = `${this.baseUrl}clockOut`;
    return this.http.post(url, payload);
  }

  getEmployeeData(): Observable<any> {
    const url = `${this.baseUrl}getEmployeeData`;
    return this.http.get(url);
  }

   // Fetch Time-In and Time-Out data for an employee
   getEmployeeTimeInOut(employeeId: number): Observable<any> {
    const url = `${this.baseUrl}getTimeInOut`;
    const body = { employee_id: employeeId };
    return this.http.post(url, body);
  }
  
}
