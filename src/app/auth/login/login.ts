
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


  // Declare a property to hold our form group. The '!' tells TypeScript
  // that we will definitely initialize this property in the constructor.
  loginForm!: FormGroup;

  // We inject the FormBuilder service in the constructor
  constructor(private fb: FormBuilder) {}

  // ngOnInit is a special "lifecycle hook" that runs once when the component is created.
  // It's the perfect place to initialize our form.
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Define the form controls. The first value is the default state (''),
      // and the second is an array of validators.
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted!', this.loginForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


}