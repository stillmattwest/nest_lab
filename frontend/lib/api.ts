import type {
  Post,
  Comment,
  User,
  PaginatedResponse,
  AuthResponse,
  MeResponse,
  ApiValidationError,
} from './types';

const API_BASE = '/api';

let tokenGetter: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setApiTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export function setApiOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: ApiValidationError; status: number }> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = tokenGetter?.() ?? null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const status = res.status;

  if (status === 401) {
    onUnauthorized?.();
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return { status };
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      error: json as ApiValidationError,
      status,
    };
  }

  return { data: json as T, status };
}

// Posts
export async function getPosts(params?: { page?: number; user_id?: number }) {
  const search = new URLSearchParams();
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.user_id != null) search.set('user_id', String(params.user_id));
  const qs = search.toString();
  const path = qs ? `/posts?${qs}` : '/posts';
  return apiFetch<PaginatedResponse<Post>>(path);
}

export async function getPost(id: number | string) {
  return apiFetch<Post>(`/posts/${id}`);
}

export async function createPost(body: { title: string; body: string }) {
  return apiFetch<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updatePost(
  id: number | string,
  body: { title?: string; body?: string }
) {
  return apiFetch<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deletePost(id: number | string) {
  return apiFetch<unknown>(`/posts/${id}`, { method: 'DELETE' });
}

// Comments
export async function getComments(postId: number | string) {
  return apiFetch<{ data: Comment[] }>(`/posts/${postId}/comments`);
}

export async function getComment(id: number | string) {
  return apiFetch<Comment>(`/comments/${id}`);
}

export async function createComment(postId: number | string, body: { body: string }) {
  return apiFetch<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateComment(
  id: number | string,
  body: { body?: string }
) {
  return apiFetch<Comment>(`/comments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteComment(id: number | string) {
  return apiFetch<unknown>(`/comments/${id}`, { method: 'DELETE' });
}

// Auth
export async function login(credentials: {
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logout() {
  return apiFetch<{ message: string }>('/logout', { method: 'POST' });
}

export async function getCurrentUser() {
  return apiFetch<MeResponse>('/user');
}
