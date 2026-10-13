import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);

  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly token = signal<string | null>(localStorage.getItem('taskhive_token'));

  private getStoredUser(): User | null {
    const saved = localStorage.getItem('taskhive_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  }

  login(payload: LoginRequest) {
    const mockResponse: AuthResponse = {
      token: 'test-token',
      user: {
        id: '1',
        name: payload.email,
        email: payload.email,
        role: 'admin'
      } as User
    };
    return {
      subscribe: (obj: any) => {
        this.setSession(mockResponse);
        obj.next(mockResponse);
      }
    } as any;
  }

  register(payload: RegisterRequest) {
    const mockResponse: AuthResponse = {
      token: 'test-token',
      user: {
        id: '1',
        name: payload.email,
        email: payload.email,
        role: 'member'
      } as User
    };
    return {
      subscribe: (obj: any) => {
        this.setSession(mockResponse);
        obj.next(mockResponse);
      }
    } as any;
  }

  logout(): void {
    localStorage.removeItem('taskhive_token');
    localStorage.removeItem('taskhive_user');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    return!!this.token();
  }

  private setSession(response: AuthResponse): void {
    const token = response.token || 'test-token';
    localStorage.setItem('taskhive_token', token);
    if (response.user) {
      let user = response.user;
      if (user.email && user.email.includes('@')) {
        const nameFromEmail = user.email.split('@')[0];
        const prettyName = nameFromEmail
         .split(/[._]/)
         .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
         .join(' ');
        user = {...user, name: prettyName } as User;
      }
      localStorage.setItem('taskhive_user', JSON.stringify(user));
      this.currentUser.set(user);
    }
    this.token.set(token);
  }
}