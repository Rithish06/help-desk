import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, loginInUrl } from '../../env/env.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private timeoutRef: any; // Holds logout timeout reference

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: object) {
    this.checkAutoLogout(); // Check logout when service is loaded
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${apiUrl}/login`, credentials, {
      withCredentials: false,
    });
  }

  saveLoginData(token: string, role: string, clientId: string): void {
    const loginTime = new Date().getTime(); // Store current timestamp
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('loginTime', JSON.stringify(loginTime));

    this.startAutoLogout(); // Start auto logout timer
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getClientId(): string | null {
    return localStorage.getItem('clientId');
  }

  startAutoLogout(): void {
    const expirationTime = 12 * 60 * 60 * 1000; // 1 hour in milliseconds

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef); // Clear any previous timeouts
    }

    this.timeoutRef = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  checkAutoLogout(): void {
    if (isPlatformBrowser(this.platformId)){
      const loginTime = localStorage.getItem('loginTime');

      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - JSON.parse(loginTime);
        const expirationTime = 12 * 60 * 60 * 1000; // 1 hour
  
        if (timeElapsed >= expirationTime) {
          this.logout();
        } else {
          this.startAutoLogout();
        }
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeoutRef) clearTimeout(this.timeoutRef);
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
