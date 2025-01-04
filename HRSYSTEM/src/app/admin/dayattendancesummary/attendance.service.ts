import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost/integapi/main/routes.php';

  constructor(private http: HttpClient) {}

  getEmployeeData(): Observable<any> {
    const url = `${this.apiUrl}?route=getEmployeeData`;
    return this.http.get(url);
  }

  getTimeInOut(employeeId: number): Observable<any> {
    const body = {
      route: 'getTimeInOut',
      employee_id: employeeId
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
