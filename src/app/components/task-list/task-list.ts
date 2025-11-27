import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { CreateTask } from '../create-task/create-task';
import { TaskTable } from '../task-table/task-table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule, PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    CreateTask,
    TabsModule,
    FormsModule,
    PaginationModule,
    TaskTable
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit, AfterViewInit, OnDestroy {

  todoTasks: Task[] = [];
  completedTasks: Task[] = [];
  deletedTasks: Task[] = [];
  isAdminUser: boolean = false;
  public currentSearchTerm: string = '';

  isLoading: boolean = false;
  activeTab: 'todo' | 'completed' | 'deleted' = 'todo';


  pagination = {
    todo: { currentPage: 1, itemsPerPage: 5, totalItems: 0 },
    completed: { currentPage: 1, itemsPerPage: 5, totalItems: 0 },
    deleted: { currentPage: 1, itemsPerPage: 5, totalItems: 0 }
  };

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  tabAnimating: boolean = false;


  constructor(
    private taskService: TaskService,
    private authService: Auth,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdminUser = this.authService.isAdmin();
    this.loadInitialData();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentSearchTerm = searchTerm;
      this.pagination.todo.currentPage = 1;
      this.pagination.completed.currentPage = 1;
      this.pagination.deleted.currentPage = 1;
      this.loadInitialData();
    });
  }

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  loadInitialData(): void {
    this.loadTodoTasks();
    this.loadCompletedTasks();
    if (this.isAdminUser) {
      this.loadDeletedTasks();
    }
  }

  loadTodoTasks(): void {
    this.isLoading = true;

    this.taskService.getTasks(
      this.currentSearchTerm,
      this.pagination.todo.currentPage,
      this.pagination.todo.itemsPerPage,
      1
    ).subscribe({
      next: (response) => {
        this.todoTasks = response.items;
        this.pagination.todo.totalItems = response.totalCount;

        if (this.todoTasks.length === 0 &&
            this.pagination.todo.currentPage > 1 &&
            this.pagination.todo.totalItems > 0) {
          this.pagination.todo.currentPage--;
          this.loadTodoTasks();
          return;
        }

        setTimeout(() => this.initializeTooltips(), 100);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load To Do tasks.');
        this.isLoading = false;
      }
    });
  }

  loadCompletedTasks(): void {
    this.isLoading = true;

    this.taskService.getTasks(
      this.currentSearchTerm,
      this.pagination.completed.currentPage,
      this.pagination.completed.itemsPerPage,
      2
    ).subscribe({
      next: (response) => {
        this.completedTasks = response.items;
        this.pagination.completed.totalItems = response.totalCount;

        if (this.completedTasks.length === 0 &&
            this.pagination.completed.currentPage > 1 &&
            this.pagination.completed.totalItems > 0) {
          this.pagination.completed.currentPage--;
          this.loadCompletedTasks();
          return;
        }

        setTimeout(() => this.initializeTooltips(), 100);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load Completed tasks.');
        this.isLoading = false;
      }
    });
  }

  loadDeletedTasks(): void {
    this.isLoading = true;

    this.taskService.getDeletedTasks().subscribe({
      next: (deleted) => {
        let filtered = deleted;
        if (this.currentSearchTerm) {
          const term = this.currentSearchTerm.toLowerCase();
          filtered = deleted.filter(task =>
            task.taskName.toLowerCase().includes(term)
          );
        }

        const startIndex = (this.pagination.deleted.currentPage - 1) * this.pagination.deleted.itemsPerPage;
        const endIndex = startIndex + this.pagination.deleted.itemsPerPage;

        this.deletedTasks = filtered.slice(startIndex, endIndex);
        this.pagination.deleted.totalItems = filtered.length;

        if (this.deletedTasks.length === 0 &&
            this.pagination.deleted.currentPage > 1 &&
            this.pagination.deleted.totalItems > 0) {
          this.pagination.deleted.currentPage--;
          this.loadDeletedTasks();
          return;
        }

        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load deleted tasks.');
        this.isLoading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

onTabSelect(tabName: 'todo' | 'completed' | 'deleted'): void {
  this.activeTab = tabName;
  this.tabAnimating = false;

  setTimeout(() => {
    this.tabAnimating = true;
    setTimeout(() => (this.tabAnimating = false), 420);
  });
}

  todoPageChanged(event: PageChangedEvent): void {
    this.pagination.todo.currentPage = event.page;
    this.loadTodoTasks();
  }

  completedPageChanged(event: PageChangedEvent): void {
    this.pagination.completed.currentPage = event.page;
    this.loadCompletedTasks();
  }

  deletedPageChanged(event: PageChangedEvent): void {
    this.pagination.deleted.currentPage = event.page;
    this.loadDeletedTasks();
  }

  private refreshActiveLists(): void {
    this.loadTodoTasks();
    this.loadCompletedTasks();
    this.loadDeletedTasks();
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Task deleted successfully!');
          this.refreshActiveLists();
        },
        error: () => this.notificationService.showError('Failed to delete task.')
      });
    }
  }

  markAsComplete(taskId: number): void {
    this.taskService.markAsComplete(taskId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Task marked as complete!');
        this.refreshActiveLists();
      },
      error: () => this.notificationService.showError('Failed to update status.')
    });
  }

  revertToDo(taskId: number): void {
    this.taskService.revertToDo(taskId).subscribe({
      next: () => {
        this.notificationService.showInfo('Task moved back to To Do.');
        this.refreshActiveLists();
      },
      error: () => this.notificationService.showError('Failed to update status.')
    });
  }

  restoreTask(taskId: number): void {
    this.taskService.restoreTask(taskId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Task restored successfully!');
        this.loadInitialData();
      },
      error: () => this.notificationService.showError('Failed to restore task.')
    });
  }

  private initializeTooltips(): void {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      const tooltip = bootstrap.Tooltip.getInstance(el as any);
      if (tooltip) tooltip.dispose();
    });
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl: any) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  onSaveInlineEdit(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.notificationService.showSuccess('Task updated successfully!');
        this.loadTodoTasks();
      },
      error: (err) => {
        this.notificationService.showError(err.error || 'Failed to update task.');
      }
    });
  }
}
