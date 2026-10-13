import { Component, inject, signal } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isCollapsed = signal(false);

  toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
  }

  showSidebar(): boolean {
    const url = this.router.url;
    return this.authService.isAuthenticated() &&
           url !== '/auth' &&
           url !== '/register';
  }

  logout(): void {
    this.authService.logout();
  }
}