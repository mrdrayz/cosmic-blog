import { memo } from 'react';
import type { ReactElement } from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps): ReactElement {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon}>⚠</span>
      <p className={styles.text}>{message}</p>
    </div>
  );
}

export default memo(ErrorMessage);
