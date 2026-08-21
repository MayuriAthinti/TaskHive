import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'taskhive_tasks';


  getTasksFromApi() {
    return this.http.get<Task[]>(
      `${this.apiUrl}/tasks`
    );
  }
  getTasks(): Task[] {
    const data = localStorage.getItem(this.storageKey);

    return data ? JSON.parse(data) : [];
  }

  
  getTask(id: string): Task | undefined {
    const tasks = this.getTasks();

    return tasks.find(task => task.id === id);
  }

  createTask(task: Partial<Task>): Task {

    const tasks = this.getTasks();

    const newTask: Task = {
      id: crypto.randomUUID(),

      title: task.title ?? '',
      description: task.description ?? '',
      status: task.status ?? 'todo',
      priority: task.priority ?? 'medium',
      projectId: task.projectId ?? '',
      assigneeId: task.assigneeId ?? '',
      dueDate: task.dueDate ?? '',

      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(tasks)
    );

    return newTask;
  }
  updateTask(id: string, task: Partial<Task>): Task | undefined {

    const tasks = this.getTasks();

    const index = tasks.findIndex(
      existingTask => existingTask.id === id
    );

    if (index === -1) {
      return undefined;
    }

    const updatedTask: Task = {
      ...tasks[index],
      ...task,
      id: tasks[index].id,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(tasks)
    );

    return updatedTask;
  }
  deleteTask(id: string): boolean {

    const tasks = this.getTasks();

    const filteredTasks = tasks.filter(
      task => task.id !== id
    );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(filteredTasks)
    );

    return true;
  }
}