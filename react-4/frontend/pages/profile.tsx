import type { ReactElement } from 'react';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import cookie from 'cookie';
import { wrapper, setUser } from '../store/store';
import { fetchCurrentUser } from '../lib/api';
import type { User } from '../types';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Profile.module.css';

interface ProfilePageProps {
  profileUser: User | null;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function ProfilePage({ profileUser }: ProfilePageProps): ReactElement {
  if (!profileUser) {
    return (
      <Layout>
        <p>Not authenticated</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.avatar}>{getInitial(profileUser.name)}</div>
          <h1 className={styles.name}>{profileUser.name}</h1>
          <p className={styles.email}>{profileUser.email}</p>
          <p className={styles.label}>Member</p>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({
      req,
    }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<ProfilePageProps>> => {
      try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.jwt;

        if (!token) {
          return { redirect: { destination: '/login', permanent: false } };
        }

        const user = await fetchCurrentUser(token);
        store.dispatch(setUser(user));

        return { props: { profileUser: user } };
      } catch {
        return { redirect: { destination: '/login', permanent: false } };
      }
    },
);

export default ProfilePage;
