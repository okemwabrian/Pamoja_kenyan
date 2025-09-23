import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { About } from './about/about';
import { Beneficiaries } from './beneficiaries/beneficiaries';
import { Contact } from './contact/contact';
import { DoubleApplication } from './double-application/double-application';
import { Home } from './home/home';
import { Membership } from './membership/membership';
import { Payments } from './payments/payments';
import { Shares } from './shares/shares';
import { SingleApplication } from './single-application/single-application';
import { Upgrade } from './upgrade/upgrade';
import { Login } from './login/login';
import { Register } from './register/register';

import { PamojaKenyaComponent } from './pamoja-kenya/pamoja-kenya.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  // Public routes
  { path: '', component: Home },                      // Home page, no sidebar
  { path: 'login', component: Login },                // Login page, no sidebar
  { path: 'register', component: Register },          // Register page, no sidebar

  // Protected routes with layout
  {
    path: '',
    component: PamojaKenyaComponent,  // layout with sidebar
    canActivate: [AuthGuard],
    children: [
      { path: 'about', component: About },
      { path: 'shares', component: Shares },
      { path: 'membership', component: Membership },
      { path: 'single-application', component: SingleApplication },
      { path: 'double-application', component: DoubleApplication },
      { path: 'payments', loadComponent: () => import('./payments/payments').then(m => m.Payments) },
      { path: 'beneficiaries', component: Beneficiaries },
      { path: 'upgrade', component: Upgrade },
      { path: 'contact', component: Contact },
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
