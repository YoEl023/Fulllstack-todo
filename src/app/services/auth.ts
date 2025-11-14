import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
   private apiUrl = `${environment.apiUrl}/auth`;
    private tokenKey = 'auth_token'; 

  constructor(private http: HttpClient) { }

  login(userData: any): Observable<any> {    
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, userData);
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

}