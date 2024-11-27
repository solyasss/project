import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login-page']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        // Токен истек
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login-page']);
        return false;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.Role === 'Admin') {
        return true;
      }

      this.router.navigate(['/login-page']);
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      this.router.navigate(['/login-page']);
      return false;
    }
  }
}
