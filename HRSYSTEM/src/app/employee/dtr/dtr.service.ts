import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DtrService {
  private baseUrl = 'http://localhost/integapi/main/routes.php?route=';

  constructor(private http: HttpClient) {}

  // Clock-in method modified to accept employeeId, date, and time
  clockIn(payload: { employee_id: number; date: string; time: string }): Observable<any> {
    const url = `${this.baseUrl}clockIn`;
    return this.http.post(url, payload); // Send the full payload with employee_id, date, and time
  }

  // Clock-out method modified to accept employeeId, date, and time
  clockOut(payload: { employee_id: number; date: string; time: string }): Observable<any> {
    const url = `${this.baseUrl}clockOut`;
    return this.http.post(url, payload); // Send the full payload with employee_id, date, and time
  }

  // Fetch employee data
  getEmployeeData(): Observable<any> {
    const url = `${this.baseUrl}getEmployeeData`;
    return this.http.get(url);
  }
}
