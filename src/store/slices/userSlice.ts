import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  type: string;
  email_verified: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  logo: string;
  company_name: string;
  vat_number: string;
  registration_number: string;
  established_year: string;
  legal_status: string;
  company_description: string;
  quotation_count: number;
  enquiry_count: number;
  last_quotation_date: string;
  last_enquiry_date: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchUsers = createAsyncThunk(
  'admin/users/fetchUsers',
  async (params: any) => {
    const response = await userApi.getAllUsers(params);
    return response.data;
  }
);

export const fetchUserDetails = createAsyncThunk(
  'admin/users/fetchUserDetails',
  async (userId: string) => {
    const response = await userApi.getUserDetails(userId);
    return response.data;
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/users/updateStatus',
  async ({ userId, data }: { userId: string; data: any }) => {
    const response = await userApi.updateUserStatus(userId, data);
    return response.data;
  }
);

export const verifySeller = createAsyncThunk(
  'users/verifySeller',
  async (userId: string) => {
    const response = await userApi.verifySeller(userId);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;