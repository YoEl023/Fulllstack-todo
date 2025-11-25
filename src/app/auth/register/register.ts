import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { AuthForm } from '../../components/auth-form/auth-form'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthForm 
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  constructor(
    private authService: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onRegister(formData: any): void {
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const errorMessage = err.error || 'Registration failed. Please try again.';
        this.notificationService.showError(errorMessage);
        console.error('Registration failed:', err);
      }
    });
  }
}