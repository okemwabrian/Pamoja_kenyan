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
  { path: '', component: Home },                      
  { path: 'login', component: Login },                
  { path: 'register', component: Register },  
  { path: 'about', component: About }, 
  { path: 'contact', component: Contact },   
  { path: 'single-application', component: SingleApplication },
  { path: 'shares', component: Shares },
      { path: 'membership', component: Membership },
      { path: 'double-application', component: DoubleApplication },
      { path: 'payments', loadComponent: () => import('./payments/payments').then(m => m.Payments) },
      { path: 'beneficiaries', component: Beneficiaries },
      { path: 'upgrade', component: Upgrade },
    

  // Protected routes with layout
  {
    path: '',
    component: PamojaKenyaComponent,  // layout with sidebar
    canActivate: [AuthGuard],
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
