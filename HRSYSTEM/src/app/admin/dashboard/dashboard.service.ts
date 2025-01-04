import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost/integapi/main/routes.php';

  constructor(private http: HttpClient) {}

  getEmployeeCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=countTotalEmployees`);
  }

  getRequestCounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=countRequestStatuses`);
  }

  getAttendanceData(): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=getAttendanceSummary`);
  }

  // Add new method to fetch employee data with dynamic filters
  getEmployeeData(filters: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=getEmployeeData`, { params: filters });
  }
}

