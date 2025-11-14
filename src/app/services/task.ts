import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth'; 
import { Task } from '../models/task.model'; 

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/tasks`; 

  constructor(
    private http: HttpClient,
    private authService: Auth
  ) { }

  getTasks(): Observable<Task[]> { 
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    
    return this.http.get<Task[]>(this.apiUrl, { headers: headers });
  }
}