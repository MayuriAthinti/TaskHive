import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../models/auth.model';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = environment.apiUrl;

  readonly currentUser = signal<User | null>(
    JSON.parse(localStorage.getItem('taskhive_user') || 'null')
  );

  readonly token = signal<string | null>(
    localStorage.getItem('taskhive_token')
  );

  login(payload: LoginRequest) {

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/auth/login`,
        payload
      )
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  register(payload: RegisterRequest) {

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/auth/register`,
        payload
      )
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  logout(): void {

    localStorage.removeItem('taskhive_token');
    localStorage.removeItem('taskhive_user');

    this.token.set(null);
    this.currentUser.set(null);

    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
  return !!localStorage.getItem('taskhive_token');

  }

  private setSession(response: AuthResponse): void {

    localStorage.setItem(
      'taskhive_token',
      response.token
    );

    localStorage.setItem(
      'taskhive_user',
      JSON.stringify(response.user)
    );

    this.token.set(response.token);

    this.currentUser.set(response.user);
  }
}