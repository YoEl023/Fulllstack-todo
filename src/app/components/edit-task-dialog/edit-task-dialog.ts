import { Component, Inject } from '@angular/core'; // 1. Import Inject
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models/task.model'; // Import our Task model

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-task-dialog.html',
  styleUrl: './edit-task-dialog.css'
})
export class EditTaskDialog {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Task 
  ) {
    this.editForm = this.fb.group({
      taskName: [data.taskName, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close(); 
  }

  onSave(): void {
    if (this.editForm.valid) {
      
      this.dialogRef.close(this.editForm.value);
    }
  }
}