import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
