import { useState, useCallback } from 'react';
import type { ReactElement, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/store';
import { loginUser } from '../lib/api';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import styles from '../styles/Auth.module.css';

function LoginPage(): ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  }, []);

  const handleLogin = useCallback(async (): Promise<void> => {
    setError('');

    try {
      const token = await loginUser(email, password);
      dispatch(setToken(token));
      router.push('/');
    } catch {
      setError('Login failed. Please check your credentials.');
    }
  }, [email, password, dispatch, router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        {error && <ErrorMessage message={error} />}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className={styles.input}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
          />
        </div>

        <button className={styles.submitButton} type="button" onClick={handleLogin}>
          Login
        </button>

        <button
          className={styles.switchButton}
          type="button"
          onClick={() => router.push('/register')}
        >
          Dont have an account? Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
