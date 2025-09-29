import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-pamoja-kenya',
  templateUrl: './pamoja-kenya.component.html',
  styleUrls: ['./pamoja-kenya.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, Header]
})
export class PamojaKenyaComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Observable to check if device is handset (mobile)
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Observable to check login status
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn();

  // Logout method
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return !!localStorage.getItem('authToken');
  }

  // Check if current user is admin
  isAdmin(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return localStorage.getItem('userRole') === 'admin';
  }

  // This method can be used if you still want to close drawer on navigation in handset
  onNavItemClicked(drawer: any) {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset && drawer) {
        drawer.close();
      }
    });
  }
}
