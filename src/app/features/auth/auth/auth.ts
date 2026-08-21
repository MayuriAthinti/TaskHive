import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginData = this.loginForm.getRawValue();

    this.authService.login(loginData).subscribe({

      next: () => {
        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: () => {
        this.loading = false;

        this.errorMessage =
          'Unable to sign in. Please check your email and password.';
      }

    });
  }
}