import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'
import { IoProvider } from 'socket.io-react-hook'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <IoProvider>
        <Component {...pageProps} />
      </IoProvider>
    </NextIntlProvider>
  )
}

export default MyApp
