import { useState, useCallback } from 'react';
import type { ReactElement, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/api';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from '../styles/Auth.module.css';

function RegisterPage(): ReactElement {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  }, []);

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  }, []);

  const handleRegister = useCallback(async (): Promise<void> => {
    setError('');

    try {
      await registerUser(email, password, name);
      router.push('/login');
    } catch {
      setError('Registration failed. Please try again.');
    }
  }, [email, password, name, router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        {error && <ErrorMessage message={error} />}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-name">
            Name
          </label>
          <input
            id="register-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="John Doe"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            className={styles.input}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
          />
        </div>

        <button className={styles.submitButton} type="button" onClick={handleRegister}>
          Register
        </button>

        <button className={styles.switchButton} type="button" onClick={() => router.push('/login')}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
