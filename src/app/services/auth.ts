import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject  } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private authToken: string | null = null;

  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
authState$ = this.authState.asObservable();



  constructor(private http: HttpClient) { 
        this.loadToken();
   this.authState.next(this.isLoggedIn());


  }

    private loadToken(): void {
    this.authToken = localStorage.getItem(this.tokenKey);
  }
 
  login(userData: any): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;


    return this.http.post(loginUrl, userData, { responseType: 'text' });
  }

 
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
        this.authToken = token;
 this.authState.next(true);
  }

  getToken(): string | null {
    return this.authToken;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
        this.authToken = null;
          this.authState.next(false);


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