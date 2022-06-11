import '../styles/globals.css'
import type { AppProps } from 'next/app'

// wrapping ourapp with session provider so that we can use our authentication in entire app
import { SessionProvider } from 'next-auth/react'
import Header from '../components/Header'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session} >
        {/* SessionProvider >> HOC - high order component */}
        <div className='h-screen overflow-y-scroll bg-slate-200'>
          {/* as header will remain for same */}
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
