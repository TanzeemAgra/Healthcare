import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Login failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/hospital/register/', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear all authentication-related localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token'); // Legacy token
      localStorage.removeItem('authToken'); // Alternative token key
      localStorage.removeItem('accessToken'); // Alternative key
      localStorage.removeItem('refreshToken'); // Alternative key
      localStorage.removeItem('selectedPlan'); // Clear any plan selection
      localStorage.removeItem('selectedPlanId'); // Clear plan ID
      localStorage.removeItem('paymentVerification'); // Clear payment data
      localStorage.removeItem('customerInfo'); // Clear customer data
      localStorage.removeItem('userRole'); // Clear any stored role
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
    },
    setUser: (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle both JWT and session-based auth responses
        if (action.payload.success && action.payload.token === 'session-based-auth') {
          // Session-based auth response
          state.isAuthenticated = true;
          state.accessToken = 'session-based-auth';
          state.refreshToken = 'session-based-auth';
          state.user = action.payload.user;
          localStorage.setItem('access_token', 'session-based-auth');
          localStorage.setItem('refresh_token', 'session-based-auth');
          localStorage.setItem('token', 'session-based-auth');
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } else if (action.payload.access && action.payload.refresh) {
          // JWT auth response
          state.isAuthenticated = true;
          state.accessToken = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.user = action.payload.user;
          localStorage.setItem('access_token', action.payload.access);
          localStorage.setItem('refresh_token', action.payload.refresh);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } else {
          // Unknown response format
          state.isAuthenticated = false;
          state.error = 'Invalid authentication response';
        }
        
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setTokens, setUser } = authSlice.actions;
export default authSlice.reducer;