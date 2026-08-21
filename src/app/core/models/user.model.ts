export type Role = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  avatar?: string;
}