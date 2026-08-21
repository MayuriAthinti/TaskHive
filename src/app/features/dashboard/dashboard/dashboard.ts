import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  tasks: Task[] = [];

  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  loading = false;
  errorMessage = '';

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {

    this.loading = true;
    this.errorMessage = '';

    try {

      const tasks = this.taskService.getTasks();

      console.log('DASHBOARD TASKS:', tasks);

      this.tasks = tasks;

      this.totalTasks = tasks.length;

      this.todoTasks =
        tasks.filter(t => t.status === 'todo').length;

      this.inProgressTasks =
        tasks.filter(t => t.status === 'in-progress').length;

      this.completedTasks =
        tasks.filter(t => t.status === 'done').length;

      this.loading = false;

    } catch (error) {

      console.error('DASHBOARD ERROR:', error);

      this.loading = false;

      this.errorMessage =
        'Unable to load tasks.';
    }
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  logout(): void {
    this.authService.logout();
  }
}