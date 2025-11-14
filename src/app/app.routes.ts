import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { MainLayout } from './components/main-layout/main-layout';
import { TaskList } from './components/task-list/task-list';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    { path: 'login', component: Login },
    
    { path: 'register', component: Register },
    {
        path: 'tasks',
        component: MainLayout, 
         canActivate: [authGuard], 
        children: [
            
            { path: '', component: TaskList } 
        ]
    }
];