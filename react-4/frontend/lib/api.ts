import axios from 'axios';
import type { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import type { Article, ArticleComment, ArticlesParams, User } from '../types';

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'jwt';

function createApiInstance(): AxiosInstance {
  const instance = axios.create({ baseURL: API_BASE_URL });

  instance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get(TOKEN_KEY);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  return instance;
}

function extractArray<T>(response: T[] | { data: T[] }): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }

  return [];
}

function normalizeImageUrl(url: string | null): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;

  return `${API_BASE_URL}${path}`;
}

function normalizeArticle(article: Article): Article {
  return {
    ...article,
    previewImage: normalizeImageUrl(article.previewImage),
  };
}

const api = createApiInstance();

export async function loginUser(email: string, password: string): Promise<string> {
  const { data } = await api.post<{ access_token: string }>('/auth/login', {
    email,
    password,
  });

  Cookies.set(TOKEN_KEY, data.access_token, { expires: 1, sameSite: 'strict' });

  return data.access_token;
}

export function logoutUser(): void {
  Cookies.remove(TOKEN_KEY);
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const { data } = await api.post<User>('/users/register', { email, password, name });

  return data;
}

export async function fetchCurrentUser(token?: string): Promise<User> {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.get<User>('/users/me', { headers });

  return data;
}

export async function fetchArticles(params?: ArticlesParams): Promise<Article[]> {
  const { data } = await api.get('/articles', { params });
  const articles = extractArray<Article>(data);

  return articles.map(normalizeArticle);
}

export async function fetchArticleById(id: number): Promise<Article> {
  const { data } = await api.get<Article>(`/articles/${id}`);

  return normalizeArticle(data);
}

export async function fetchCommentsByArticleId(articleId: number): Promise<ArticleComment[]> {
  const { data } = await api.get(`/comments/article/${articleId}`);

  return extractArray<ArticleComment>(data);
}

export async function createComment(content: string, articleId: number): Promise<ArticleComment> {
  const { data } = await api.post<ArticleComment>('/comments', { content, articleId });

  return data;
}

export async function createArticle(
  title: string,
  content: string,
  previewImage?: File,
): Promise<Article> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);

  if (previewImage) {
    formData.append('previewImage', previewImage);
  }

  const { data } = await api.post<Article>('/articles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return normalizeArticle(data);
}

export async function updateArticle(id: number, title: string, content: string): Promise<Article> {
  const { data } = await api.patch<Article>(`/articles/${id}`, { title, content });

  return normalizeArticle(data);
}

export async function deleteArticle(id: number): Promise<void> {
  await api.delete(`/articles/${id}`);
}
