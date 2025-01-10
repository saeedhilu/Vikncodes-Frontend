import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types for your state
type User = {
  role : string;
  email: string;
  
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

// Define the initial state based on the type
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action for login
    login: (state, action: PayloadAction<{ access: string; refresh: string; user: User }>) => {
      const { access, refresh, user } = action.payload;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.user = user;
    },
    
    // Action for logout
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    
    // Action for updating token
    updateToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    
    // Action to clear auth data
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { login, logout, updateToken, clearAuth } = authSlice.actions;

export default authSlice.reducer;
