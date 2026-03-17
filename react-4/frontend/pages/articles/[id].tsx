import { useState, useCallback, useMemo } from 'react';
import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import cookie from 'cookie';
import { wrapper, setUser } from '../../store/store';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  fetchCurrentUser,
  fetchArticleById,
  fetchCommentsByArticleId,
  createComment,
} from '../../lib/api';
import type { Article, ArticleComment } from '../../types';
import Layout from '../../components/Layout/Layout';
import CommentItem from '../../components/CommentItem/CommentItem';
import CommentForm from '../../components/CommentForm/CommentForm';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from '../../styles/Article.module.css';

interface ArticlePageProps {
  article: Article | null;
  initialComments: ArticleComment[];
}

function ArticlePage({ article, initialComments }: ArticlePageProps): ReactElement {
  const user = useSelector((state: RootState) => state.auth.user);

  const safeInitialComments = useMemo<ArticleComment[]>(
    () => (Array.isArray(initialComments) ? initialComments : []),
    [initialComments],
  );

  const [comments, setComments] = useState<ArticleComment[]>(safeInitialComments);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthor = useMemo<boolean>(
    () => Boolean(user && article?.author && user.id === article.author.id),
    [user, article],
  );

  const handleAddComment = useCallback(
    async (content: string): Promise<void> => {
      if (!article) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const newComment = await createComment(content, article.id);
        setComments((prev) => [...prev, newComment]);
      } catch {
        setError('Failed to add comment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [article],
  );

  if (!article) {
    return (
      <Layout>
        <ErrorMessage message="Article not found" />
      </Layout>
    );
  }

  const authorName = article.author?.name ?? 'Unknown author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            ← Back to articles
          </Link>
          {isAuthor && (
            <Link href={`/articles/edit/${article.id}`} className={styles.editButton}>
              ✎ Edit Article
            </Link>
          )}
        </div>

        {article.previewImage && (
          <div className={styles.imageWrapper}>
            <Image
              className={styles.image}
              src={article.previewImage}
              alt={article.title}
              fill
              sizes="800px"
            />
          </div>
        )}

        <div className={styles.authorSection}>
          <div className={styles.authorAvatar}>{authorInitial}</div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{authorName}</span>
            <span className={styles.authorLabel}>Author</span>
          </div>
        </div>

        <h1 className={styles.title}>{article.title}</h1>

        <div className={styles.descriptionBlock}>
          <span className={styles.descriptionLabel}>Description</span>
          <p className={styles.content}>{article.content}</p>
        </div>

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments ({comments.length})</h2>

          {comments.length > 0 ? (
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <p className={styles.noComments}>No comments yet</p>
          )}

          {error && <ErrorMessage message={error} />}

          {user ? (
            <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
          ) : (
            <p className={styles.loginHint}>
              <Link href="/login" className={styles.loginHintLink}>
                Log in
              </Link>{' '}
              to leave a comment
            </p>
          )}
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }: GetServerSidePropsContext): Promise<{ props: ArticlePageProps }> => {
      try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.jwt;

        if (token) {
          const fetchedUser = await fetchCurrentUser(token);
          store.dispatch(setUser(fetchedUser));
        }
      } catch {
        /* user not authenticated */
      }

      const articleId = Number(params?.id);
      const emptyResult: ArticlePageProps = { article: null, initialComments: [] };

      if (isNaN(articleId)) {
        return { props: emptyResult };
      }

      try {
        const article = await fetchArticleById(articleId);
        const initialComments = await fetchCommentsByArticleId(articleId);

        return { props: { article, initialComments } };
      } catch {
        return { props: emptyResult };
      }
    },
);

export default ArticlePage;
