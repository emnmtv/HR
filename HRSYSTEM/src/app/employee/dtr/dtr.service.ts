import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DtrService {
  private baseUrl = 'http://localhost/integapi/main/routes.php?route=';

  constructor(private http: HttpClient) {}

  clockIn(employeeId: number): Observable<any> {
    const url = `${this.baseUrl}clockIn`;
    return this.http.post(url, { employee_id: employeeId });
  }

  clockOut(employeeId: number): Observable<any> {
    const url = `${this.baseUrl}clockOut`;
    return this.http.post(url, { employee_id: employeeId });
  }

  getEmployeeData(): Observable<any> {
    const url = `${this.baseUrl}getEmployeeData`;
    return this.http.get(url);
  }
}
