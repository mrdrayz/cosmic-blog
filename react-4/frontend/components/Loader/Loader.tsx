import { memo } from 'react';
import type { ReactElement } from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const SIZE_MAP: Record<string, number> = {
  small: 24,
  medium: 40,
  large: 64,
};

function Loader({ size = 'medium' }: LoaderProps): ReactElement {
  const dimension = SIZE_MAP[size];

  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.spinner} style={{ width: dimension, height: dimension }} />
    </div>
  );
}

export default memo(Loader);
