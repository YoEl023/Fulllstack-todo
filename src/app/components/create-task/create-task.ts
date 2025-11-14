import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css'
})
export class CreateTask implements OnInit {
  @Output() taskCreated = new EventEmitter<void>();
  
  
  createTaskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService 
  ) {}

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      taskName: ['', Validators.required]
    });
  }

 onSubmit(): void {
    if (this.createTaskForm.valid) {
      this.taskService.createTask(this.createTaskForm.value).subscribe({
        next: (newTask) => {
          console.log('Task created successfully!', newTask);
          this.taskCreated.emit();
          this.createTaskForm.reset();
        },
        error: (err) => {
          console.error('Failed to create task:', err);
        }
      });
    }
  }
}