import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component';
import { ThreadListComponent } from './features/forum/thread-list/thread-list.component';
import { ThreadDetailComponent } from './features/forum/thread-detail/thread-detail.component';
import { ThreadCreateComponent } from './features/forum/thread-create/thread-create.component';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/auth/login']);
  return false;
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forum',
    children: [
      { path: '', component: ThreadListComponent },
      { path: 'create-thread', component: ThreadCreateComponent, canActivate: [authGuard] },
      { path: 'threads/:id', component: ThreadDetailComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
