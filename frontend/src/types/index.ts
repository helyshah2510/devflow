export interface Project {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  members?: User[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  createdById: number;
  assignedToId?: number | null;
  project?: Project;
  assignedTo?: User | null;
}

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  taskId: number;
  userId: number;
  user?: User;
}

export interface AdminDashboard {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface AdminUser {
  id: number;
  email: string;
  role: Role;
  isActive: boolean;
}