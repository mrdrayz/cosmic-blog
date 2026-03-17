import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import { wrapper, setUser } from '../store/store';
import { fetchCurrentUser, fetchArticles } from '../lib/api';
import type { Article } from '../types';
import Layout from '../components/Layout/Layout';
import SearchBar from '../components/SearchBar/SearchBar';
import ArticleCard from '../components/ArticleCard/ArticleCard';
import Loader from '../components/Loader/Loader';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import { useArticles } from '../hooks/useArticles';
import styles from '../styles/Home.module.css';

interface HomePageProps {
  initialArticles: Article[];
}

function HomePage({ initialArticles = [] }: HomePageProps): ReactElement {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const {
    articles: searchedArticles,
    isLoading,
    error,
  } = useArticles(undefined, undefined, hasSearched && searchQuery ? searchQuery : undefined);

  const safeInitial = useMemo<Article[]>(
    () => (Array.isArray(initialArticles) ? initialArticles : []),
    [initialArticles],
  );

  const displayedArticles = useMemo<Article[]>(
    () => (hasSearched && searchQuery ? searchedArticles : safeInitial),
    [hasSearched, searchQuery, searchedArticles, safeInitial],
  );

  useEffect(() => {
    const handleRouteChange = (): void => {
      setSearchQuery('');
      setHasSearched(false);
      setResetKey((prev) => prev + 1);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleSearch = useCallback((query: string): void => {
    if (query.length === 0) {
      setSearchQuery('');
      setHasSearched(false);
      return;
    }

    setSearchQuery(query);
    setHasSearched(true);
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Cosmic Blog</h1>
          <p className={styles.subtitle}>Explore articles from across the universe</p>
        </section>

        <div className={styles.searchWrapper}>
          <SearchBar key={resetKey} onSearch={handleSearch} />
        </div>

        {hasSearched && isLoading && <Loader />}

        {error && <ErrorMessage message={error} />}

        {!isLoading && displayedArticles.length === 0 && (
          <p className={styles.empty}>
            {hasSearched ? 'No articles found for your query' : 'No articles yet'}
          </p>
        )}

        <div className={styles.grid}>
          {displayedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }: GetServerSidePropsContext): Promise<{ props: HomePageProps }> => {
      try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.jwt;

        if (token) {
          const user = await fetchCurrentUser(token);
          store.dispatch(setUser(user));
        }
      } catch {
        /* user not authenticated */
      }

      let initialArticles: Article[] = [];

      try {
        initialArticles = await fetchArticles({ limit: 50 });
      } catch {
        /* articles unavailable */
      }

      return { props: { initialArticles } };
    },
);

export default HomePage;
