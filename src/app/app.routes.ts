import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { MainLayout } from './components/main-layout/main-layout';
import { TaskList } from './components/task-list/task-list';
import { authGuard } from './services/auth.guard';
import { loginGuard } from './services/login.guard';
import { NotFound } from './components/not-found/not-found';
import { notFoundRedirectGuard } from './services/not-found-redirect.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

      { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register, canActivate: [loginGuard] }, 
      { path: 'tasks', component: TaskList, canActivate: [authGuard] },

      { 
    path: '**', 
    canActivate: [notFoundRedirectGuard], component: NotFound 
  }
];