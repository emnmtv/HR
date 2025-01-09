import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeeData';

  constructor(private http: HttpClient) {}

  // Fetch employee data by ID
  getEmployeeById(id: number): Observable<any> {
    const url = `${this.apiUrl}&id=${id}`;
    return this.http.get(url);
  }

  // Fetch all employees
  getAllEmployees(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
  getEmployeeData(employeeId: number): Observable<any> {
    const url = `${this.apiUrl}&employee_id=${employeeId}`;
    return this.http.get(url);
  }
}
