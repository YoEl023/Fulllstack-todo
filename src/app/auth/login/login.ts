import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { AuthForm } from '../../components/auth-form/auth-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    AuthForm
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(
    private authService: Auth,
    private router: Router,
    private notificationService: NotificationService 
  ) {}
  
  onLogin(formData: any): void {
    this.authService.login(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Login successful!');
        this.authService.saveToken(response);
        this.router.navigate(['/tasks']); 
      },
      error: (err) => {
        const errorMessage = err.error || 'Invalid username or password.';
        this.notificationService.showError(errorMessage);
      }
    });
  }
}