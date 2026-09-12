import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the User type to match your backend response
export type User = {
  id: number;
  name: string;
  email: string;
};

// 2. Define the structure of the entire Auth state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// 3. Apply the type to your initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user; // Fixed: Uncommented this line
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;