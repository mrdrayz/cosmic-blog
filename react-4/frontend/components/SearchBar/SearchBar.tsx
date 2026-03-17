import { memo, useState, useCallback } from 'react';
import type { ReactElement, FormEvent, ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

function SearchBar({
  onSearch,
  placeholder = 'Search articles...',
  initialValue = '',
}: SearchBarProps): ReactElement {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const newValue = event.target.value;
      setValue(newValue);

      if (newValue.trim().length === 0) {
        onSearch('');
      }
    },
    [onSearch],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      onSearch(value.trim());
    },
    [onSearch, value],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
}

export default memo(SearchBar);
