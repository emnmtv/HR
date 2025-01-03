import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost/integapi/main/routes.php';

  constructor(private http: HttpClient) {}

  // Fetch pending requests
  getPendingRequests(employeeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?route=getPendingRequests&employee_id=${employeeId}`);
  }

  // Create a new request
  createRequest(request: { employee_id: number; date: string; type: string; reason: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, { route: 'createRequest', ...request }, { headers });
  }
}
