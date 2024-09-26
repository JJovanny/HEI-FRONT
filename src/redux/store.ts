import { AnyAction, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logger from 'redux-logger'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { RootReducer } from './rootReducer'
import { isDev } from 'src/utils/Utils'

const config = {
  blacklist: ['LoadingReducer', 'LoginReducer', 'RegisterReducer', 'RememberPasswordReducer'],
  key: 'root',
  storage: AsyncStorage,
  timeout: 0, // The code base checks for falsy, so 0 disables (Avoid error for redux-persist)
  version: -1
  // whitelist: ['UserReducer'],
  // migrate: createMigrate(migrations, { debug: true }),
  // debug: true //to get useful logging
}

const reducer = persistReducer(config, RootReducer)

const middleware = isDev() ? [thunk, logger] : [thunk]
const initialState = {}

export const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;
