import { Component, inject } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
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