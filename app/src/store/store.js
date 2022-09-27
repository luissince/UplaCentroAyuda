import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notifeSlice from './notifeSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { dashboardApi } from '../api/dashboardApi';

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    notifications: notifeSlice,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dashboardApi.middleware),
});

setupListeners(store.dispatch);