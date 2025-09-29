import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about';
import { Beneficiaries } from './beneficiaries/beneficiaries';
import { AuthGuard, AdminGuard } from './auth.guard';

import { PamojaKenyaComponent } from './pamoja-kenya/pamoja-kenya.component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'about', component: About },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.Contact) },
  { path: 'membership', loadComponent: () => import('./membership/membership').then(m => m.Membership) },
  { path: 'single-application', loadComponent: () => import('./single-application/single-application').then(m => m.SingleApplication) },
  { path: 'double-application', loadComponent: () => import('./double-application/double-application').then(m => m.DoubleApplication) },
  { path: 'shares', loadComponent: () => import('./shares/shares').then(m => m.Shares) },
  { path: 'payments', loadComponent: () => import('./payments/payments').then(m => m.Payments) },
  { path: 'beneficiaries', component: Beneficiaries },
  { path: 'announcements', loadComponent: () => import('./announcements/announcements').then(m => m.Announcements) },
  { path: 'upgrade', loadComponent: () => import('./upgrade/upgrade').then(m => m.Upgrade) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password/:uid/:token', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPassword) },
  
  // Protected routes
  { path: 'user-dashboard', loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent), canActivate: [AuthGuard] },
  { path: 'my-events', loadComponent: () => import('./user-events/user-events').then(m => m.UserEvents), canActivate: [AuthGuard] },
  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.Profile), canActivate: [AuthGuard] },
  { path: 'claims', loadComponent: () => import('./claims/claims').then(m => m.Claims), canActivate: [AuthGuard] },
  
  // Admin routes
  { path: 'admin-login', loadComponent: () => import('./admin-login/admin-login').then(m => m.AdminLogin) },
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard), canActivate: [AdminGuard] },
  

  
  // Connection test route
  { path: 'connection-test', loadComponent: () => import('./connection-test').then(m => m.ConnectionTest) },
  
  // Home route
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  
  // Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
