import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css'
})
export class CreateTask implements OnInit {
  @Output() taskCreated = new EventEmitter<void>();
  createTaskForm!: FormGroup;
  createTaskFormSubmitted = false;


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private notificationService: NotificationService 
  ) {}

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
      this.createTaskFormSubmitted = true;
    if (this.createTaskForm.valid) {
      this.taskService.createTask(this.createTaskForm.value).subscribe({
        next: (newTask) => {
           this.notificationService.showSuccess('Task added successfully!');
          this.taskCreated.emit();
          this.createTaskForm.reset();
        },
        error: (err) => {
          const errorMessage = err.error || 'Failed to create task. Please try again.';
          this.notificationService.showError(errorMessage);
          console.error('Failed to create task:', err);
        }
      });
    }
  }
}