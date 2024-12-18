import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost/integapi/main/routes.php?route=loginHR'; // Updated API URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string, accountType: string): Observable<any> {
    const body = {
      email: email,
      password: password,
      account_type: accountType, // Sending account_type instead of system
    };

    return this.http.post<any>(this.apiUrl, body);
  }
}
