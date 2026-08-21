import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { ProjectsComponent } from './features/projects/projects/projects';
import { CreateProjectComponent } from './features/projects/create-project/create-project';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth/auth')
        .then(m => m.AuthComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  {
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/dashboard/dashboard/dashboard')
      .then(m => m.Dashboard)
},

{
  path: 'tasks',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/tasks/tasks/tasks')
      .then(m => m.TasksComponent)
},

{
  path: 'tasks/create',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/tasks/create-task/create-task')
      .then(m => m.CreateTaskComponent)
},
 {
    path: 'projects',
    component: ProjectsComponent
  },

  {
    path: 'projects/create',
    component: CreateProjectComponent
  }


];