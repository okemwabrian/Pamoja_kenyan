import { Component, signal, OnInit } from '@angular/core';
import { Background3D } from './shared/3d-background';
import { Header } from './header/header';
import { BackendStatusComponent } from './backend-status.component';
import { ClearDataService } from './clear-data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [Background3D, Header, BackendStatusComponent, RouterModule]
})
export class App implements OnInit {
  protected readonly title = signal('Pamoja_Kenya');
  
  constructor(private clearDataService: ClearDataService) {}
  
  ngOnInit() {
    // Clear all default data on app startup
    this.clearDataService.clearAllDefaultData();
  }
}
