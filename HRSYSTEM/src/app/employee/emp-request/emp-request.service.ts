import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpRequestService {
  private apiUrl = 'http://localhost/integapi/main/routes.php';

  constructor(private http: HttpClient) {}

  // Get pending requests for an employee
  getPendingRequests(employeeId: number): Observable<any> {
    const url = `${this.apiUrl}?route=getPendingRequests&employee_id=${employeeId}`;
    return this.http.get<any>(url);
  }

  // Submit a new request
  createRequest(requestData: any): Observable<any> {
    const url = `${this.apiUrl}?route=createRequest`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, requestData, { headers });
  }
}
