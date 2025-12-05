import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  username: string = '';

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        const token = this.authService.getToken();
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
          this.username = decodedToken[nameClaim] || 'User';
        }
      } else {
        this.username = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
