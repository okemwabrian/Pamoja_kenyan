import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about';
import { Beneficiaries } from './beneficiaries/beneficiaries';
import { AuthGuard, AdminGuard } from './auth.guard';



export const routes: Routes = [
  // Public routes (no authentication required)
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.Contact) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password/:uid/:token', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPassword) },
  
  // Protected routes (authentication required)
  { path: 'about', component: About, canActivate: [AuthGuard] },
  { path: 'membership', loadComponent: () => import('./membership/membership').then(m => m.Membership), canActivate: [AuthGuard] },
  { path: 'single-application', loadComponent: () => import('./single-application/single-application').then(m => m.SingleApplication), canActivate: [AuthGuard] },
  { path: 'double-application', loadComponent: () => import('./double-application/double-application').then(m => m.DoubleApplication), canActivate: [AuthGuard] },
  { path: 'shares', loadComponent: () => import('./shares/shares').then(m => m.Shares), canActivate: [AuthGuard] },
  { path: 'payments', loadComponent: () => import('./payments/payments').then(m => m.Payments), canActivate: [AuthGuard] },
  { path: 'beneficiaries', component: Beneficiaries, canActivate: [AuthGuard] },
  { path: 'announcements', loadComponent: () => import('./announcements/announcements').then(m => m.Announcements), canActivate: [AuthGuard] },
  { path: 'upgrade', loadComponent: () => import('./upgrade/upgrade').then(m => m.Upgrade), canActivate: [AuthGuard] },
  
  // User dashboard and profile routes
  { 
    path: 'user-dashboard', 
    loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent), 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./user-dashboard/dashboard-overview').then(m => m.DashboardOverview) },
      { path: 'profile', loadComponent: () => import('./user-dashboard/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'payments', loadComponent: () => import('./user-dashboard/payment-history/payment-history.component').then(m => m.PaymentHistoryComponent) },
      { path: 'applications', loadComponent: () => import('./user-dashboard/my-applications/my-applications.component').then(m => m.MyApplicationsComponent) }
    ]
  },
  { path: 'my-events', loadComponent: () => import('./user-events/user-events').then(m => m.UserEvents), canActivate: [AuthGuard] },
  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.Profile), canActivate: [AuthGuard] },
  { path: 'claims', loadComponent: () => import('./claims/claims').then(m => m.Claims), canActivate: [AuthGuard] },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home), canActivate: [AuthGuard] },
  
  // Admin routes (backend managed)
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard), canActivate: [AdminGuard] },
  

  

  
  // Redirect based on authentication status
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Wildcard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
