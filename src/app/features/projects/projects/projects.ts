import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  showModal = false;
  isEditing = false;
  editingId: string | null = null;

  form: any = {
    name: '',
    description: '',
    status: 'active'
  };

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projects = this.projectService.getProjects();
  }

  openCreate() {
    this.isEditing = false;
    this.editingId = null;
    this.form = { name: '', description: '', status: 'active' };
    this.showModal = true;
  }

  editProject(project: any) {
    this.isEditing = true;
    this.editingId = project.id;
    this.form = { name: project.name, description: project.description, status: project.status };
    this.showModal = true;
  }

  saveProject() {
    if(!this.form.name.trim()) return;
    if(this.isEditing && this.editingId){
      this.projectService.updateProject(this.editingId, this.form);
    } else {
      this.projectService.createProject(this.form);
    }
    this.closeModal();
    this.loadData();
  }

  deleteProject(id: string) {
    if(!confirm('Delete project?')) return;
    this.projectService.deleteProject(id);
    this.loadData();
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }
}