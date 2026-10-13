import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const loginData = this.loginForm.getRawValue();

    console.log('LOGIN DATA:', loginData);

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('LOGIN SUCCESS:', response);
        console.log('Stored token:', localStorage.getItem('taskhive_token'));
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('LOGIN ERROR:', error);
        this.loading = false;
        this.errorMessage = error?.message || 'Unable to sign in. Please try again.';
      },
      complete: () => {
        console.log('LOGIN REQUEST COMPLETED');
      }
    });
  }
}