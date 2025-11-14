import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon'; 
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-main-layout',
  standalone: true,
 imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],  
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

    constructor(
    private authService: Auth,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
    console.log('User logged out');
  }

}