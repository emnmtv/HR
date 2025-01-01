import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: 'admin' | 'employee' | null = null;

  login(role: 'admin' | 'employee') {
    this.userRole = role;
  }

  getUserRole(): 'admin' | 'employee' | null {
    return this.userRole;
  }

  logout() {
    this.userRole = null;
  }
}
