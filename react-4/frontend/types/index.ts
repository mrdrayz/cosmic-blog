export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  previewImage: string | null;
  author?: User;
}

export interface ArticleComment {
  id: number;
  content: string;
  user?: User;
}

export interface ArticlesParams {
  limit?: number;
  page?: number;
  query?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
