import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  tasks: Task[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  loadTasks(): void {

    this.loading = true;
    this.errorMessage = '';

    try {

      this.tasks = this.taskService.getTasks();

      console.log('LOCAL TASKS:', this.tasks);

      this.loading = false;

    } catch (error) {

      console.error('LOAD TASKS ERROR:', error);

      this.loading = false;
      this.errorMessage = 'Unable to load tasks.';
    }
  }

  deleteTask(id: string): void {

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {

      const deleted = this.taskService.deleteTask(id);

      if (deleted) {

        this.tasks =
          this.tasks.filter(task => task.id !== id);

        console.log('TASK DELETED:', id);
      }

    } catch (error) {

      console.error('DELETE TASK ERROR:', error);

      this.errorMessage =
        'Unable to delete task.';
    }
  }
}