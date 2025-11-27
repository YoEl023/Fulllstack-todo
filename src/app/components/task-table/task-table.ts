import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.css'
})
export class TaskTable implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['tasks'] && this.tasks && this.tasks.length > 0) {
    this.sortDirection = 'asc';  
    this.onSortByName();
  }
}

  @Input() tasks: Task[] = [];
  @Input() tableType: 'todo' | 'completed' | 'deleted' = 'todo';
  @Input() isAdmin: boolean = false;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;

  @Output() complete = new EventEmitter<number>();
  @Output() revert = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() restore = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>(); //       
  @Output() saveEdit = new EventEmitter<Task>();    

  sortDirection: 'asc' | 'desc' = 'asc';

  editingTaskId: number | null = null;  
  editTaskName: string = '';            

 

  onSortByName(): void {
    const sorted = [...this.tasks].sort((a, b) => {
      const nameA = (a.taskName || '').toLowerCase();
      const nameB = (b.taskName || '').toLowerCase();

      if (nameA < nameB) return this.sortDirection === 'asc' ? -1 : 1;
      if (nameA > nameB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.tasks = sorted;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  startInlineEdit(task: Task): void {
    this.editingTaskId = task.taskID;
    this.editTaskName = task.taskName;
  }

  cancelInlineEdit(): void {
    this.editingTaskId = null;
    this.editTaskName = '';
  }

  saveInlineEdit(task: Task): void {
    const updatedTask: Task = {
      ...task,
      taskName: this.editTaskName.trim()
    };

    this.saveEdit.emit(updatedTask);

    this.editingTaskId = null;
    this.editTaskName = '';
  }
}
