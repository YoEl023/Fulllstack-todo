import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { Auth } from '../../services/auth';

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


  
  loginForm!: FormGroup;

  
 constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      
      username: ['', Validators.required],
      passwordHash: ['', Validators.required]
    });
  }

   onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          
          this.authService.saveToken(response);

          
          this.router.navigate(['/tasks']); 
        },
        error: (err) => {
          console.error('Login failed:', err);

        }
      });
    }
  }
}