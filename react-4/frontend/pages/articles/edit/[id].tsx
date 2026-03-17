import { useState, useCallback } from 'react';
import type { ReactElement, ChangeEvent, FormEvent } from 'react';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import { wrapper, setUser } from '../../../store/store';
import { fetchCurrentUser, fetchArticleById, updateArticle } from '../../../lib/api';
import type { Article } from '../../../types';
import Layout from '../../../components/Layout/Layout';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import styles from '../../../styles/EditArticle.module.css';

interface EditArticlePageProps {
  article: Article;
}

function EditArticlePage({ article }: EditArticlePageProps): ReactElement {
  const router = useRouter();
  const [title, setTitle] = useState<string>(article.title);
  const [content, setContent] = useState<string>(article.content);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  }, []);

  const handleContentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(event.target.value);
  }, []);

  const handleCancel = useCallback((): void => {
    router.push(`/articles/${article.id}`);
  }, [router, article.id]);

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
        await updateArticle(article.id, trimmedTitle, trimmedContent);
        router.push(`/articles/${article.id}`);
      } catch {
        setError('Failed to update article. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, content, article.id, router],
  );

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Article</h1>

        {error && <ErrorMessage message={error} />}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-title">
              Title
            </label>
            <input
              id="edit-title"
              className={styles.input}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Article title..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-content">
              Content
            </label>
            <textarea
              id="edit-content"
              className={styles.textarea}
              value={content}
              onChange={handleContentChange}
              placeholder="Article content..."
              disabled={isSubmitting}
            />
          </div>

          <p className={styles.hint}>Image can only be set when creating an article</p>

          <div className={styles.buttons}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting || title.trim().length === 0 || content.trim().length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({
      req,
      params,
    }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<EditArticlePageProps>> => {
      try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.jwt;

        if (!token) {
          return { redirect: { destination: '/login', permanent: false } };
        }

        const user = await fetchCurrentUser(token);
        store.dispatch(setUser(user));

        const articleId = Number(params?.id);

        if (isNaN(articleId)) {
          return { redirect: { destination: '/', permanent: false } };
        }

        const article = await fetchArticleById(articleId);

        if (!article.author || article.author.id !== user.id) {
          return {
            redirect: { destination: `/articles/${articleId}`, permanent: false },
          };
        }

        return { props: { article } };
      } catch {
        return { redirect: { destination: '/', permanent: false } };
      }
    },
);

export default EditArticlePage;
