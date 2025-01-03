// dtr-summary.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtrSummaryService {

  private apiUrl = 'http://localhost/integapi/main/routes.php'; // API endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch time-in and time-out data for an employee
  getTimeInOut(employeeId: number): Observable<any> {
    // Prepare the request body
    const body = {
      route: 'getTimeInOut',
      employee_id: employeeId
    };

    // Send a POST request with the body content
    return this.http.post<any>(this.apiUrl, body);
  }
}
