import { Component, signal } from '@angular/core';
import { Background3D } from './shared/3d-background';
import { Header } from './header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [Background3D, Header, RouterModule]
})
export class App {
  protected readonly title = signal('Pamoja_Kenya');
}
