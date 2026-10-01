import { getToken } from './jwt';
import type { Project, Task, Comment, User, AdminDashboard, AdminUser, Role } from '@/src/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';

    throw new Error('Session expired');
  }

  if (response.status === 403) {
    let message = 'You are not allowed to access this resource.';

    try {
      const data = await response.json();

      if (typeof data.message === 'string') {
        message = data.message;
      }
    } catch {
      // Keep the default message if response isn't JSON
    }

    throw new Error(message);
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (typeof data.message === 'string') {
        message = data.message;
      } else if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      }
    } catch {
      // Keep the default message if response isn't JSON
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/projects');
}

export async function register(
  email: string,
  password: string
): Promise<void> {
  await apiFetch<unknown>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getTasks(): Promise<Task[]> {
  return apiFetch<Task[]>('/task');
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiFetch<unknown>(`/task/${taskId}`, {
    method: 'DELETE',
  });
}

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return apiFetch<AdminDashboard>('/admin/dashboard');
}

export async function updateTaskStatus(
  taskId: number,
  status: string
): Promise<Task> {
  return apiFetch<Task>(
    `/task/${taskId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
}

export async function createTask(
  data: {
    title: string;
    description?: string;
    priority: string;
    projectId: number;
    assignedToId?: number;
  }
): Promise<Task> {
  return apiFetch<Task>(
    '/task',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function getComments(
  taskId: number
): Promise<Comment[]> {
  return apiFetch<Comment[]>(
    `/comment/task/${taskId}`
  );
}

export async function createComment(
  data: {
    content: string;
    taskId: number;
  }
): Promise<Comment> {
  return apiFetch<Comment>(
    '/comment',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function deleteComment(
  commentId: number
): Promise<void> {
  return apiFetch<void>(
    `/comment/${commentId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function getAllUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>('/users/all');
}

export async function updateUserRole(
  userId: number,
  role: Role
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function setUserActive(
  userId: number,
  isActive: boolean
): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function createProject(data: {
  name: string;
  description?: string;
  memberIds: number[];
}): Promise<Project> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteProject(projectId: number): Promise<void> {
  await apiFetch<unknown>(`/projects/${projectId}`, {
    method: 'DELETE',
  });
}

export async function updateProject(
  projectId: number,
  data: { name?: string; description?: string; memberIds?: number[] }
): Promise<Project> {
  return apiFetch<Project>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}