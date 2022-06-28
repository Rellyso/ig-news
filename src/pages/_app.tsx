import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { Router } from 'next/router';

import { Header } from '../components/Header';

import '../styles/global.scss';
import '../styles/nprogress.scss';
import { SessionProvider } from 'next-auth/react';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start();
})

Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp;
