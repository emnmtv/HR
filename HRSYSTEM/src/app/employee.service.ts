import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost/integapi/main/routes.php?route=getEmployeeData';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<{ status: string; data: any[] }>(this.apiUrl).pipe(
      map((response) => {
        if (response.status === 'success') {
          // Filter out only employee accounts
          return response.data.filter((emp) => emp.account_type === 'Employee');
        }
        return [];
      })
    );
  }
}
