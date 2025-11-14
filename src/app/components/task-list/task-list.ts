import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';
import { Auth } from '../../services/auth';
import { CreateTask } from '../create-task/create-task';
import { EditTaskDialog } from '../edit-task-dialog/edit-task-dialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    CreateTask,
    MatDialogModule,
     MatFormFieldModule, 
    MatInputModule  
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  todoTasks: Task[] = [];
  completedTasks: Task[] = [];
  deletedTasks: Task[] = [];
  isAdminUser: boolean = false;
  
  displayedColumns: string[] = []; 
  
  deletedDisplayedColumns: string[] = ['sno', 'taskName', 'username', 'actions'];
  private currentSearchTerm: string = '';


  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.isAdminUser = this.authService.isAdmin();

    if (this.isAdminUser) {
      this.displayedColumns = ['sno', 'taskName', 'username', 'status', 'actions'];
    } else {
      this.displayedColumns = ['sno', 'taskName', 'status', 'actions'];
    }

    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks(this.currentSearchTerm).subscribe({
      next: (allTasks) => {
        this.todoTasks = allTasks.filter(task => task.statusID === 1);
        this.completedTasks = allTasks.filter(task => task.statusID === 2);
      },
      error: (err) => console.error('Failed to load tasks:', err)
    });


    if (this.isAdminUser) {
      this.taskService.getDeletedTasks().subscribe({
        next: (deleted) => { this.deletedTasks = deleted; },
        error: (err) => console.error('Failed to load deleted tasks:', err)
      });
    }

    
  }

    onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentSearchTerm = input.value;
    this.loadTasks();
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialog, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedTask: Task = { ...task, taskName: result.taskName };
        this.taskService.updateTask(updatedTask).subscribe({
          next: () => this.loadTasks(),
          error: (err) => console.error('Failed to update task:', err)
        });
      }
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Failed to delete task:', err)
      });
    }
  }

  markAsComplete(taskId: number): void {
    this.taskService.markAsComplete(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to mark task as complete:', err)
    });
  }

  revertToDo(taskId: number): void {
    this.taskService.revertToDo(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to revert task:', err)
    });
  }

  restoreTask(taskId: number): void {
    this.taskService.restoreTask(taskId).subscribe({
      next: () => {
        console.log('Task restored successfully');
        this.loadTasks();
      },
      error: (err) => console.error('Failed to restore task:', err)
    });
  }
}