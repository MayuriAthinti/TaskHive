import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  successMessage = '';

  registerForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

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

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData = this.registerForm.getRawValue();

    this.authService.register(registerData).subscribe({

      next: () => {

        this.loading = false;

        this.successMessage =
          'Account created successfully!';

        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 1000);
      },

      error: () => {

        this.loading = false;

        this.errorMessage =
          'Unable to create account. Please try again.';
      }

    });
  }
}