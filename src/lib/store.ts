import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { 
  persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// 1. Dummy storage for Next.js server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: any) { return Promise.resolve(null); },
    setItem(_key: any, value: any) { return Promise.resolve(value); },
    removeItem(_key: any) { return Promise.resolve(); },
  };
};
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// 2. Configure persistence for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  // blacklist: ['accessToken'], // Security tip: uncomment this to keep the token in memory only
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

// 3. Create the store with the middleware checks disabled for persist actions
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];