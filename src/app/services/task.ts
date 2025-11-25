import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(searchTerm: string = '', pageNumber: number = 1, pageSize: number = 5, statusId?: number): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (searchTerm) {
      params = params.append('search', searchTerm);
    }
    if (statusId != null) {
      params = params.append('statusId', statusId.toString());
    }
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders(), params: params });
  }

  createTask(taskData: { taskName: string }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData, { headers: this.getAuthHeaders() });
  }

  updateTask(task: Task): Observable<void> {
    const updateUrl = `${this.apiUrl}/${task.taskID}`;
    return this.http.put<void>(updateUrl, task, { headers: this.getAuthHeaders() });
  }

  deleteTask(taskId: number): Observable<void> {
    const deleteUrl = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(deleteUrl, { headers: this.getAuthHeaders() });
  }

  markAsComplete(taskId: number): Observable<void> {
    const completeUrl = `${this.apiUrl}/${taskId}/complete`;
    return this.http.post<void>(completeUrl, {}, { headers: this.getAuthHeaders() });
  }

  revertToDo(taskId: number): Observable<void> {
    const revertUrl = `${this.apiUrl}/${taskId}/revert`;
    return this.http.post<void>(revertUrl, {}, { headers: this.getAuthHeaders() });
  }

  getDeletedTasks(): Observable<Task[]> {
    const deletedUrl = `${this.apiUrl}/deleted`;
    return this.http.get<Task[]>(deletedUrl, { headers: this.getAuthHeaders() });
  }

  restoreTask(taskId: number): Observable<void> {
    const restoreUrl = `${this.apiUrl}/${taskId}/restore`;
    return this.http.post<void>(restoreUrl, {}, { headers: this.getAuthHeaders() });
  }
}