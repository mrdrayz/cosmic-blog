import { useState, useCallback } from 'react';
import type { ReactElement, ChangeEvent, FormEvent } from 'react';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import { wrapper, setUser } from '../../store/store';
import { fetchCurrentUser, createArticle } from '../../lib/api';
import Layout from '../../components/Layout/Layout';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from '../../styles/CreateArticle.module.css';

interface CreateArticlePageProps {
  authenticated: boolean;
}

function CreateArticlePage({ authenticated }: CreateArticlePageProps): ReactElement {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  }, []);

  const handleContentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(event.target.value);
  }, []);

  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (trimmedTitle.length === 0 || trimmedContent.length === 0) {
        setError('Title and content are required.');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        const article = await createArticle(trimmedTitle, trimmedContent, image ?? undefined);
        router.push(`/articles/${article.id}`);
      } catch {
        setError('Failed to create article. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, content, image, router],
  );

  if (!authenticated) {
    return (
      <Layout>
        <ErrorMessage message="You must be logged in to create an article." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Article</h1>

        {error && <ErrorMessage message={error} />}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="article-title">
              Title
            </label>
            <input
              id="article-title"
              className={styles.input}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter article title..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="article-content">
              Content
            </label>
            <textarea
              id="article-content"
              className={styles.textarea}
              value={content}
              onChange={handleContentChange}
              placeholder="Write your article..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="article-image">
              Preview Image (optional)
            </label>
            <input
              id="article-image"
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <p className={styles.warning}>⚠ The preview image cannot be changed after publishing</p>
          </div>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting || title.trim().length === 0 || content.trim().length === 0}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({
      req,
    }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<CreateArticlePageProps>> => {
      try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.jwt;

        if (!token) {
          return { redirect: { destination: '/login', permanent: false } };
        }

        const user = await fetchCurrentUser(token);
        store.dispatch(setUser(user));

        return { props: { authenticated: true } };
      } catch {
        return { redirect: { destination: '/login', permanent: false } };
      }
    },
);

export default CreateArticlePage;
