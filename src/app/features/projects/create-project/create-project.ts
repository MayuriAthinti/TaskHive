import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css'
})
export class CreateProjectComponent {

  private readonly fb = inject(FormBuilder);
  private readonly projectService =
    inject(ProjectService);

  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  projectForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    description: [''],

    status: this.fb.nonNullable.control<
      'active' | 'completed' | 'on-hold'
    >(
      'active',
      Validators.required
    )
  });

  onSubmit(): void {

    if (this.projectForm.invalid) {

      this.projectForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {

      const projectData =
        this.projectForm.getRawValue();

      const project =
        this.projectService.createProject(
          projectData
        );

      console.log(
        'PROJECT CREATED:',
        project
      );

      this.loading = false;

      this.router.navigate(['/projects']);

    } catch (error) {

      console.error(
        'CREATE PROJECT ERROR:',
        error
      );

      this.loading = false;

      this.errorMessage =
        'Unable to create project.';
    }
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}