/* eslint-disable @next/next/no-sync-scripts */
import 'styles/globals.css'
import 'styles/custom.css'
import 'styles/bootstrap-pincode-input.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import Script from 'next/script'
import Head from 'next/head.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { persistor, store } from 'src/redux/store'
import { useDispatch } from 'src/redux/hooks'
import { apiGetAppConfig, apiGetI18n } from 'src/app/AppActions'
import { initTranslations } from 'src/resources/locales/i18n'

export default function AppWrapper ({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Toaster position='bottom-right' />
        <BrowserRouter>
          <App Component={Component} pageProps={pageProps} router={router} />
        </BrowserRouter>
      </PersistGate>
    </Provider>

  )
}

function App ({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    import('../styles/js/custom.js')
    import('bootstrap/dist/js/bootstrap.js')
    // @ts-ignore
    import('../styles/js/popper.min.js')
  }, [])

  useEffect(() => {
    dispatch(apiGetAppConfig())
    initTranslations()
    dispatch(apiGetI18n())
  }, [])

  return (
    <>
      <Script
        src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js'
        integrity='sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3'
        crossOrigin='anonymous'
      />

      <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js' />

      <Script
        src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js'
        integrity='sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V'
        crossOrigin='anonymous'
      />

      <Head>
        <title>Eco Healthy Internacional</title> 
      </Head>
      <Component {...pageProps} />
    </>
  )
}
