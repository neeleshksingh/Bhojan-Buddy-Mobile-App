import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  phone: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  phone: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.phone = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.phone = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;