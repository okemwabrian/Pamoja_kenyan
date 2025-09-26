import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pamoja-kenya',
  templateUrl: './pamoja-kenya.component.html',
  styleUrls: ['./pamoja-kenya.component.css'],
  standalone: false
})
export class PamojaKenyaComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  // This method can be used if you still want to close drawer on navigation in handset
  onNavItemClicked(drawer: any) {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset && drawer) {
        drawer.close();
      }
    });
  }
}
