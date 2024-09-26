import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from 'src/redux/store'

export default function RootLayout ({ children }: { children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  )
}
