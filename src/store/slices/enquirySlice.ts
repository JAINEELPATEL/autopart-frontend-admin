import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enquiryApi } from '../services/api';

interface EnquiryItem {
    id: string;
    product_type_id: number;
    status: string;
    details: string;
    image: string[];
    product_type: {
      id: number;
      name: string;
    };
  }
  
  interface EnquirySeller {
    id: string;
    name: string;
    email: string;
  }
  
  interface Buyer {
    id: string;
    name: string;
    email: string;
  }
  
  interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    gearbox: string;
    fuel: string;
  }
  
  interface Enquiry {
    id: string;
    buyer_id: string;
    vehicle_id: number;
    message: string | null;
    status: string;
    created_at: string;
    enquiry_sellers: EnquirySeller[];
    buyer: Buyer;
    vehicle: Vehicle;
    enquiry_items: EnquiryItem[];
    quotation_count: number;
  }
  
  interface EnquiryState {
    enquiries: Enquiry[];
    loading: boolean;
    error: string | null;
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  }
  
  const initialState: EnquiryState = {
    enquiries: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
    },
  };

export const fetchEnquiries = createAsyncThunk(
  'admin/enquiries/fetchEnquiries',
  async (params: any) => {
    const response = await enquiryApi.getAllEnquiries(params);
    return response.data;
  }
);

export const fetchQuotationsByEnquiry = createAsyncThunk(
  'admin/enquiries/fetchQuotations',
  async (enquiryId: string) => {
    const response = await enquiryApi.getQuotationsByEnquiry(enquiryId);
    return response.data;
  }
);

const enquirySlice = createSlice({
    name: 'enquiries',
    initialState,
    reducers: {
      clearEnquiries: (state) => {
        state.enquiries = [];
        state.error = null;
      },
      updateEnquiryStatus: (state, action) => {
        const { enquiryId, status } = action.payload;
        const enquiry = state.enquiries.find(e => e.id === enquiryId);
        if (enquiry) {
          enquiry.status = status;
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchEnquiries.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEnquiries.fulfilled, (state, action) => {
          state.loading = false;
          state.enquiries = action.payload.data;
          state.pagination = action.payload.pagination;
        })
        .addCase(fetchEnquiries.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch enquiries';
        });
    },
  });

  export const { clearEnquiries, updateEnquiryStatus } = enquirySlice.actions;
  export default enquirySlice.reducer;