import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../services/api';

interface Admin {
  id: string;
  name: string;
  email: string;
  type: string;
  phone_number?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  admin: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authApi.login(credentials);
    return response.data;
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (adminData: { name: string; email: string; phone_number: string; password: string; confirmPassword: string }) => {
    const response = await authApi.signup(adminData);
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getCurrentAdmin = createAsyncThunk(
  'auth/getCurrentAdmin',
  async () => {
    const response = await authApi.getCurrentAdmin();
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('token', action.payload);
        } else {
          localStorage.removeItem('token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);

        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        // For signup, we might not get a token immediately if email verification is required
        if (action.payload.token) {
          state.admin = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
          }
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Logout failed';
      })
      // Get current admin
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.admin = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentAdmin.rejected, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;