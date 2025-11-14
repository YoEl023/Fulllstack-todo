import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }
 
  login(userData: any): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;


    return this.http.post(loginUrl, userData, { responseType: 'text' });
  }

 
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

    register(userData: any): Observable<any> {
    const registerUrl = `${this.apiUrl}/register`;
    return this.http.post(registerUrl, userData);
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; 
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      
      if (decodedToken[roleClaim] && decodedToken[roleClaim] === 'Admin') {
        return true;
      }
    }
    return false;
  }
}