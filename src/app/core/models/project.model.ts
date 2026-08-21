export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}