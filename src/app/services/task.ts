import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http'; 
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

   getTasks(searchTerm: string = ''): Observable<Task[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

       let params = new HttpParams();
    if (searchTerm) {
      params = params.append('search', searchTerm);
    }

        return this.http.get<Task[]>(this.apiUrl, { headers: headers, params: params });

    
    return this.http.get<Task[]>(this.apiUrl, { headers: headers });
  }
  createTask(taskData: { taskName: string }): Observable<Task> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Task>(this.apiUrl, taskData, { headers: headers });
  }


deleteTask(taskId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const deleteUrl = `${this.apiUrl}/${taskId}`;

    return this.http.delete<void>(deleteUrl, { headers: headers });
  }

markAsComplete(taskId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const completeUrl = `${this.apiUrl}/${taskId}/complete`;
    return this.http.post<void>(completeUrl, {}, { headers: headers }); // Note: Sending an empty body {}
  }

  revertToDo(taskId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const revertUrl = `${this.apiUrl}/${taskId}/revert`;
    return this.http.post<void>(revertUrl, {}, { headers: headers });
  }


   updateTask(task: Task): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const updateUrl = `${this.apiUrl}/${task.taskID}`;

    return this.http.put<void>(updateUrl, task, { headers: headers });
  }

getDeletedTasks(): Observable<Task[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const deletedUrl = `${this.apiUrl}/deleted`;
    return this.http.get<Task[]>(deletedUrl, { headers: headers });
  }

  restoreTask(taskId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const restoreUrl = `${this.apiUrl}/${taskId}/restore`;
    return this.http.post<void>(restoreUrl, {}, { headers: headers });
  }

}