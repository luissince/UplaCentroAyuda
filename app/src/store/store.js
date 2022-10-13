import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notifeSlice from './notifeSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apis } from '../api/apis';

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    notifications: notifeSlice,
    [apis.reducerPath]: apis.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.middleware),
});

setupListeners(store.dispatch);