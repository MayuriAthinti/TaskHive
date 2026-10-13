import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storageKey = 'taskhive_tasks';

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data? JSON.parse(data) : [];
    } catch { return []; }
  }

  createTask(task: Partial<Task>): Task {
    const tasks = this.getTasks();
    const newTask: any = {
      id: crypto.randomUUID(),
      title: task.title?? '',
      description: task.description?? '',
      status: (task as any).status?? 'todo',
      projectId: (task as any).projectId?? '',
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.save(tasks);
    return newTask;
  }

  // FIXED DELETE - THIS IS WHY IT WAS RE-APPEARING
  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filtered = tasks.filter((t:any) => t.id!== id);
    this.save(filtered);
    console.log('Deleted task', id, 'Remaining:', filtered.length);
    return true;
  }

  updateTask(id: string, task: Partial<Task>): Task | undefined {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t:any) => t.id === id);
    if(idx === -1) return undefined;
    tasks[idx] = {...tasks[idx],...task, id: tasks[idx].id, updatedAt: new Date().toISOString() };
    this.save(tasks);
    return tasks[idx];
  }

  private save(tasks: Task[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}