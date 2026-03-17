import { useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Header from '../Header/Header';
import { logoutUser } from '../../lib/api';
import { setUser, setToken } from '../../store/store';
import type { RootState } from '../../store/store';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): ReactElement {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = useCallback((): void => {
    logoutUser();
    dispatch(setUser(null));
    dispatch(setToken(null));
    router.push('/login');
  }, [dispatch, router]);

  return (
    <div className={styles.layout}>
      <Header user={user} onLogout={handleLogout} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
