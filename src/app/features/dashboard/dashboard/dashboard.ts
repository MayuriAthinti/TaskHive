import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private authService = inject(AuthService);

  tasks: any[] = [];
  projects: any[] = [];
  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  showProfileMenu = false;
  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    console.log('DASHBOARD INIT');
    this.loadData();
  }

  get userData(): any {
    return typeof this.currentUser === 'function'? (this.currentUser as any)() : this.currentUser;
  }
  get displayName(): string {
    return this.userData?.name || this.userData?.username || this.userData?.email?.split('@')[0] || 'Chinni';
  }
  get displayInitial(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  loadData(): void {
    this.tasks = this.taskService.getTasks() || [];
    console.log('Tasks loaded:', this.tasks);

    this.projects = this.projectService.getProjects() || [];
    console.log('Projects loaded:', this.projects);
    console.log('localStorage raw:', localStorage.getItem('taskhive_projects'));

    this.totalTasks = this.tasks.length;
    this.todoTasks = this.tasks.filter((t:any) => t.status === 'todo').length;
    this.inProgressTasks = this.tasks.filter((t:any) => t.status === 'in-progress' || t.status === 'in_progress').length;
    this.completedTasks = this.tasks.filter((t:any) => t.status === 'done' || t.status === 'completed').length;
  }

  toggleProfile(): void { this.showProfileMenu =!this.showProfileMenu; }
  goToTasks(): void { this.router.navigate(['/tasks']); }
  goToProjects(): void { this.router.navigate(['/projects']); }
  logout(): void { this.authService.logout(); }
}