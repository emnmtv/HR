import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getEmployeeData(filters: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=getEmployeeData`, { params: filters });
  }

  getEmployeesPerCompany(): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=getAllCompaniesWithEmployeeCount`);
  }

  // Add new method to check all employees' time-in status
  checkAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}?route=checkAllEmployeesTimeIn`);
  }
  getEmployeeDataByCompany(company: string): Observable<any> {
    const apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeesByCompany';
    const body = { company }; // Send the company as part of the request body
    return this.http.post<any>(apiUrl, body); // Use POST to send the payload
  }
  
    // Add method for fetching today's attendance
    getTodayAttendance(): Observable<any> {
      return this.http.get(`${this.baseUrl}?route=getTodayAttendance`);
    }
    getEmployeeAttendanceData(employeeId: string): Observable<any> {
      const apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeeAttendanceData';
      const body = { employee_id: employeeId }; // Send the employee_id as part of the request body
      return this.http.post<any>(apiUrl, body); // Use POST to send the payload
    }
   // Modify the method to accept filter parameters
   getAttendance(filters: any = {}): Observable<any> {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get(`${this.baseUrl}?route=insertEmployeeAttendance`, { params });
  }
  getEmployeeDataWithPayslips(filters: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?route=getEmployeeDataWithPayslips`, { params: filters });
  }

  getMedicalDocuments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?route=fetchAllMedicalDocuments`);
  }

    // Fetch all requests
    fetchAllRequests(): Observable<any> {
      return this.http.get(`${this.baseUrl}?route=fetchAllRequests`);
    }
}

