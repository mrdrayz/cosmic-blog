import { memo } from 'react';
import type { ReactElement } from 'react';
import type { ArticleComment } from '../../types';
import styles from './CommentItem.module.css';

interface CommentItemProps {
  comment: ArticleComment;
}

function CommentItem({ comment }: CommentItemProps): ReactElement {
  const authorName = comment.user?.name ?? 'Anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div className={styles.avatar}>{authorInitial}</div>
        <span className={styles.authorName}>{authorName}</span>
      </div>
      <p className={styles.content}>{comment.content}</p>
    </div>
  );
}

export default memo(CommentItem);
