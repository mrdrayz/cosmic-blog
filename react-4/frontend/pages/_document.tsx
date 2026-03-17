import { Html, Head, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';

export default function Document(): ReactElement {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/faviconBlog.png" />
        <meta
          name="description"
          content="Cosmic Blog — explore articles from across the universe"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}