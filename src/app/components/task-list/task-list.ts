import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model'; 
import { TaskService } from '../../services/task'; 

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks loaded successfully:', this.tasks);
      },
      error: (err) => {
        console.error('Failed to load tasks:', err);
      }
    });
  }
}