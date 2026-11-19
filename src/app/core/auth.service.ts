import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'shd_session_token';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Credenciales de demostración indicadas en la hoja del proyecto.
    if (username.trim() === 'admin' && password === '12345') {
      const fakeToken = 'shd-demo-token-' + Date.now();
      localStorage.setItem(this.tokenKey, fakeToken);
      localStorage.setItem('shd_username', username.trim());
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUsername(): string {
    return localStorage.getItem('shd_username') || 'admin';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('shd_username');
    this.router.navigate(['/login']);
  }
}