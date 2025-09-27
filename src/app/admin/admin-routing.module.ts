import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent) 
  },
  { 
    path: 'applications', 
    loadComponent: () => import('./applications/applications.component').then(m => m.ApplicationsComponent) 
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./payments/payments.component').then(m => m.PaymentsComponent) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }