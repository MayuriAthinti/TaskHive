import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  projects: any[] = [];
  filter: string = 'all';
  showModal = false;
  isEditing = false;
  editingId: string | null = null;

  form: any = {
    title: '',
    description: '',
    projectId: '',
    status: 'todo'
  };

  constructor(private taskService: TaskService, private projectService: ProjectService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.tasks = this.taskService.getTasks();
    this.projects = this.projectService.getProjects();
    if(this.projects.length > 0 &&!this.form.projectId){
      this.form.projectId = this.projects[0].id;
    }
    this.applyFilter();
  }

  applyFilter() {
    if(this.filter === 'all'){
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter((t:any) => t.status === this.filter);
    }
  }

  getProjectName(id: string) {
    const p = this.projects.find((x:any) => x.id === id);
    return p? p.name : 'No Project';
  }

  openCreate() {
    this.isEditing = false;
    this.editingId = null;
    this.form = { title: '', description: '', projectId: this.projects[0]?.id || '', status: 'todo' };
    this.showModal = true;
  }

  editTask(task: any) {
    this.isEditing = true;
    this.editingId = task.id;
    this.form = { title: task.title, description: task.description, projectId: task.projectId, status: task.status };
    this.showModal = true;
  }

  saveTask() {
    if(!this.form.title.trim()) return;
    if(this.isEditing && this.editingId){
      this.taskService.updateTask(this.editingId, this.form);
    } else {
      this.taskService.createTask(this.form);
    }
    this.closeModal();
    this.loadData();
  }

  deleteTask(id: string) {
    if(!confirm('Delete task?')) return;
    this.taskService.deleteTask(id);
    this.loadData();
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }
}