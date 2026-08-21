import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css'
})
export class CreateTaskComponent {

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  taskForm = this.fb.nonNullable.group({

    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    description: [''],

    status: this.fb.nonNullable.control<
      'todo' | 'in-progress' | 'done'
    >(
      'todo',
      Validators.required
    ),

    priority: this.fb.nonNullable.control<
      'low' | 'medium' | 'high'
    >(
      'medium',
      Validators.required
    ),

    projectId: [
      '',
      Validators.required
    ],

    assigneeId: [
      '',
      Validators.required
    ],

    dueDate: ['']
  });

  onSubmit(): void {

    console.log('CREATE TASK BUTTON CLICKED');

    if (this.taskForm.invalid) {

      console.log('FORM IS INVALID');

      this.taskForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const taskData = this.taskForm.getRawValue();

    console.log('SENDING TASK:', taskData);

    try {

      const createdTask =
        this.taskService.createTask(taskData);

      console.log(
        'TASK SAVED IN LOCALHOST:',
        createdTask
      );

      this.loading = false;

      this.router.navigate(['/tasks']);

    } catch (error) {

      console.error(
        'CREATE TASK ERROR:',
        error
      );

      this.loading = false;

      this.errorMessage =
        'Unable to create task. Please try again.';
    }
  }

  cancel(): void {

    this.router.navigate(['/tasks']);

  }
}