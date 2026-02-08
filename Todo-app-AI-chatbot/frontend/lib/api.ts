import { Task } from '@/lib/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Please log in to continue.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = { detail: response.statusText };
  }

  if (response.ok) {
    return data as T;
  }

  const errorMessage = (data as { detail?: string })?.detail || 'Something went wrong';

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
    throw new ApiError('Session expired. Please log in again.', 401, data);
  }

  throw new ApiError(errorMessage, response.status, data);
}

export async function createTask(
  title: string,
  description?: string,
  category?: string | null,
  priority?: string,
  due_date?: Date | null
): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description: description || null,
        category: category || null,
        priority: priority || 'medium',
        due_date: due_date ? due_date.toISOString() : null,
      }),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to create task: ${(error as Error).message}`);
  }
}

export async function getTasks(completed?: boolean): Promise<Task[]> {
  try {
    const url = new URL(`${API_URL}/api/tasks`);
    if (completed !== undefined) {
      url.searchParams.set('completed', String(completed));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<{ tasks: Task[]; total: number }>(response);
    return data.tasks;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to fetch tasks: ${(error as Error).message}`);
  }
}

export async function getTask(id: number): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to fetch task: ${(error as Error).message}`);
  }
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
    category?: string | null;
    priority?: string;
    due_date?: Date | null;
    order?: number;
  }
): Promise<Task> {
  try {
    const payload = {
      ...data,
      due_date: data.due_date ? data.due_date.toISOString() : data.due_date === null ? null : undefined,
    };

    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to update task: ${(error as Error).message}`);
  }
}

export async function toggleComplete(id: number): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to toggle task: ${(error as Error).message}`);
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse<void>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to delete task: ${(error as Error).message}`);
  }
}