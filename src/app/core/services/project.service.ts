import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly storageKey = 'taskhive_projects';

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data? JSON.parse(data) : [];
    } catch { return []; }
  }

  createProject(project: Partial<Project>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: project.name?? '',
      description: project.description?? '',
      status: project.status?? 'active',
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    this.save(projects);
    return newProject;
  }

  updateProject(id: string, project: Partial<Project>): Project | undefined {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    projects[index] = {...projects[index],...project, id: projects[index].id, updatedAt: new Date().toISOString() };
    this.save(projects);
    return projects[index];
  }

  // THIS WAS THE BUG - FIXED NOW
  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id!== id);
    this.save(filtered);

    // Also delete all tasks of this project
    const tasksRaw = localStorage.getItem('taskhive_tasks');
    if(tasksRaw){
      let tasks = JSON.parse(tasksRaw);
      tasks = tasks.filter((t:any) => t.projectId!== id);
      localStorage.setItem('taskhive_tasks', JSON.stringify(tasks));
    }
    console.log('Deleted project', id, 'Remaining:', filtered);
    return true;
  }

  private save(projects: Project[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getProject(id: string): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  }
}