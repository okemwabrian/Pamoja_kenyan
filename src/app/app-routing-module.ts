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

const routes: Routes = [
  {path:'contact',component:Contact},
  {path:'',component:Home},
  {path:'about',component:About},
  {path:'shares',component:Shares},
  {path:'membership',component:Membership},
  {path:'single-application',component:SingleApplication},
  {path:'double-application',component:DoubleApplication},
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments').then(m => m.Payments)
  },
  { path: '', redirectTo: '/single-application', pathMatch: 'full' },
  //{ path: '**', redirectTo: '/single-application' },
  {path: 'beneficiaries',component:Beneficiaries},
  {path:'upgrade',component:Upgrade}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
