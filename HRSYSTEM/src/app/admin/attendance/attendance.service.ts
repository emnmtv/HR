import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  generateDTR(employeeId: number, startDate: string, endDate: string): Observable<any> {
    const body = {
      route: 'generateDtr',
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
