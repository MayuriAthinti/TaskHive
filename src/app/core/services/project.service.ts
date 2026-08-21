import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly storageKey = 'taskhive_projects';

  getProjects(): Project[] {
    const data = localStorage.getItem(this.storageKey);

    return data ? JSON.parse(data) : [];
  }

  getProject(id: string): Project | undefined {
    const projects = this.getProjects();

    return projects.find(project => project.id === id);
  }

  createProject(
    project: Partial<Project>
  ): Project {

    const projects = this.getProjects();

    const newProject: Project = {
      id: crypto.randomUUID(),

      name: project.name ?? '',

      description: project.description ?? '',

      status: project.status ?? 'active',

      createdAt: new Date().toISOString()
    };

    projects.push(newProject);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(projects)
    );

    return newProject;
  }

  updateProject(
    id: string,
    project: Partial<Project>
  ): Project | undefined {

    const projects = this.getProjects();

    const index = projects.findIndex(
      existingProject => existingProject.id === id
    );

    if (index === -1) {
      return undefined;
    }

    const updatedProject: Project = {
      ...projects[index],
      ...project,
      id: projects[index].id,
      updatedAt: new Date().toISOString()
    };

    projects[index] = updatedProject;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(projects)
    );

    return updatedProject;
  }

  deleteProject(id: string): boolean {

    const projects = this.getProjects();

    const filteredProjects =
      projects.filter(project => project.id !== id);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filteredProjects)
    );

    return true;
  }
}