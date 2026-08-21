import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit {

  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  projects: Project[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {

    this.loading = true;
    this.errorMessage = '';

    try {

      this.projects =
        this.projectService.getProjects();

      console.log('LOCAL PROJECTS:', this.projects);

      this.loading = false;

    } catch (error) {

      console.error('LOAD PROJECTS ERROR:', error);

      this.loading = false;
      this.errorMessage = 'Unable to load projects.';
    }
  }

  createProject(): void {
    this.router.navigate(['/projects/create']);
  }

  deleteProject(id: string): void {

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    this.projectService.deleteProject(id);

    this.loadProjects();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}