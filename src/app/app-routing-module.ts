import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about';
import { Beneficiaries } from './beneficiaries/beneficiaries';
import { DoubleApplication } from './double-application/double-application';


import { PamojaKenyaComponent } from './pamoja-kenya/pamoja-kenya.component';
import { authGuard } from './auth-guard';

const routes: Routes = [
  // Public routes
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'about', component: About },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.Contact) },
  { path: 'single-application', loadComponent: () => import('./single-application/single-application').then(m => m.SingleApplication) },
  { path: 'shares', loadComponent: () => import('./shares/shares').then(m => m.Shares) },
  { path: 'membership', loadComponent: () => import('./membership/membership').then(m => m.Membership) },
  { path: 'double-application', component: DoubleApplication },
  { path: 'payments', loadComponent: () => import('./payments/payments').then(m => m.Payments) },
  { path: 'beneficiaries', component: Beneficiaries },
  { path: 'upgrade', loadComponent: () => import('./upgrade/upgrade').then(m => m.Upgrade) },
    

  // Protected routes with layout
  {
    path: '',
    component: PamojaKenyaComponent,  
    canActivate: [authGuard],
    children: [
      
      
      
    ]
  },

  // Wildcard
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
