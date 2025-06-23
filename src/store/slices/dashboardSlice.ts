import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../services/api';

interface DashboardState {
  loading: boolean;
  error: string | null;
  stats: any; // You can replace 'any' with a more specific type if you want
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  stats: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getStats();
      return response.data.data;
    } catch (error: any) {
      // Axios error handling
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch dashboard stats';
      });
  },
});

export default dashboardSlice.reducer;