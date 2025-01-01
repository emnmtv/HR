import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://your-api-url/employees'; // Replace with actual API URL

  constructor(private http: HttpClient) {}

  getEmployees(filters: { [key: string]: string } = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get(this.apiUrl, { params });
  }
}
