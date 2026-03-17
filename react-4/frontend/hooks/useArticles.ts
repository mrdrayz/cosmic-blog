import { useState, useEffect, useCallback } from 'react';
import { fetchArticles } from '../lib/api';
import type { Article } from '../types';

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArticles(limit?: number, page?: number, query?: string): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchArticles({ limit, page, query });
      setArticles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load articles';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, query]);

  useEffect(() => {
    if (query !== undefined) {
      loadArticles();
    }
  }, [query, loadArticles]);

  return { articles, isLoading, error, refetch: loadArticles };
}
