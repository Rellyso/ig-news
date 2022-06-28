import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client'
import { Router } from 'next/router';

import { Header } from '../components/Header';

import '../styles/global.scss';
import '../styles/nprogress.scss';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start();
})

Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp;
