import { memo, useCallback, useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { User } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

function Header({ user, onLogout }: HeaderProps): ReactElement {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = useCallback((): void => {
    if (router.pathname === '/') {
      router.replace('/', undefined, { shallow: false }).then(() => {
        router.reload();
      });
    }
  }, [router]);

  const handleToggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback((): void => {
    setIsMenuOpen(false);
    onLogout();
  }, [onLogout]);

  const handleCloseMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} data-testid="header-logo" onClick={handleLogoClick}>
          Cosmic Blog
        </Link>
        <div className={styles.links}>
          {user ? (
            <>
              <Link href="/articles/create" className={styles.createButton}>
                ✦ Create New Article
              </Link>
              <div className={styles.userMenu} ref={menuRef}>
                <button
                  className={styles.userButton}
                  type="button"
                  onClick={handleToggleMenu}
                  aria-expanded={isMenuOpen}
                >
                  <span className={styles.userAvatar}>{user.name.charAt(0).toUpperCase()}</span>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.chevron}>{isMenuOpen ? '▲' : '▼'}</span>
                </button>
                {isMenuOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/profile" className={styles.dropdownItem} onClick={handleCloseMenu}>
                      Profile
                    </Link>
                    <button className={styles.dropdownItem} type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default memo(Header);
