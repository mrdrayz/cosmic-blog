import { memo, useState, useCallback } from 'react';
import type { ReactElement, FormEvent, ChangeEvent } from 'react';
import styles from './CommentForm.module.css';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}

function CommentForm({ onSubmit, isSubmitting = false }: CommentFormProps): ReactElement {
  const [content, setContent] = useState<string>('');

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const trimmed = content.trim();

      if (trimmed.length === 0) {
        return;
      }

      onSubmit(trimmed);
      setContent('');
    },
    [content, onSubmit],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={handleChange}
        placeholder="Write a comment..."
        rows={3}
        disabled={isSubmitting}
      />
      <button
        className={styles.button}
        type="submit"
        disabled={isSubmitting || content.trim().length === 0}
      >
        {isSubmitting ? 'Sending...' : 'Add Comment'}
      </button>
    </form>
  );
}

export default memo(CommentForm);
