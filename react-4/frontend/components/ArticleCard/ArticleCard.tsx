import { memo } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import SafeImage from '../SafeImage/SafeImage';
import type { Article } from '../../types';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
}

const PREVIEW_LENGTH = 150;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trimEnd() + '...';
}

function ArticleCard({ article }: ArticleCardProps): ReactElement {
  const preview = truncateText(article.content, PREVIEW_LENGTH);
  const authorName = article.author?.name ?? 'Unknown author';

  return (
    <Link href={`/articles/${article.id}`} className={styles.card}>
      {article.previewImage && (
        <div className={styles.imageWrapper}>
          <SafeImage
            src={article.previewImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.content}>{preview}</p>
        <div className={styles.footer}>
          <span className={styles.author}>✦ {authorName}</span>
        </div>
      </div>
    </Link>
  );
}

export default memo(ArticleCard);
