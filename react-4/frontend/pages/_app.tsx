import type { AppProps } from 'next/app';
import Head from 'next/head';
import { wrapper } from '../store/store';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <title>Cosmic Blog</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(App);
