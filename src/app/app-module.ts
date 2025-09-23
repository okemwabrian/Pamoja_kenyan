import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { About } from './about/about';
import { Beneficiaries } from './beneficiaries/beneficiaries';
import { Contact } from './contact/contact';
import { DoubleApplication } from './double-application/double-application';
import { Home } from './home/home';
import { Membership } from './membership/membership';
import { Payments } from './payments/payments';
import { Shares } from './shares/shares';
import { SingleApplication } from './single-application/single-application';
import { PamojaKenyaComponent } from './pamoja-kenya/pamoja-kenya.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Upgrade } from './upgrade/upgrade';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Login } from './login/login';
import { Register } from './register/register';
import { Header } from './header/header';

@NgModule({
  declarations: [
    App,
    About,
    Beneficiaries,
    Contact,
    DoubleApplication,
    Home,
    Membership,
    //Payments,
    Shares,
    SingleApplication,
    PamojaKenyaComponent,
    //Upgrade,
    Login,
    
    Header,
    
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
     BrowserAnimationsModule,
     ReactiveFormsModule,
     HttpClientModule,
     MatSnackBarModule,
      Register,
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
