import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeeData';

  constructor(private http: HttpClient) { }

  // Get employee data from PHP backend
  getEmployeeData(filters: any = {}): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: filters
    };

    return this.http.get<any>(this.apiUrl, httpOptions);
  }
}
