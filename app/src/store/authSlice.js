import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: true,
  user: null,
  authentication: false,
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    restore: (state, action)=>{
      state.loading = false;
      state.user = action.payload.user;
      state.authentication = action.payload.authentication;
    },
    login: (state, action) => {
      state.authentication = true;
      state.user = action.payload.user;
      window.localStorage.setItem('login', JSON.stringify( action.payload.user));
    },
    logout: (state) => {
      window.localStorage.clear();
      state.loading = true;
      state.user = null;
      state.authentication = false;
    },
  },
})

export const { login, logout ,restore} = authSlice.actions

export default authSlice.reducer