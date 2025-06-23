import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quotationApi } from '../services/api';

interface Seller {
  id: string;
  name: string;
  email: string;
  company_name: string;
}

interface Buyer {
  id: string;
  name: string;
  email: string;
}

interface EnquirySeller {
  id: string;
  name: string;
  email: string;
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
}

interface ProductType {
  id: number;
  name: string;
}

interface EnquiryItem {
  id: string;
  product_type_id: number;
  details: string;
  image: string[];
  product_type: ProductType;
}

interface QuotationItem {
  id: string;
  quotation_id: string;
  enquiry_item_id: string;
  status: string;
  quoted_price: string;
  delivery_time: string;
  delivery_charges: string;
  condition: string;
  guarantee: string;
  invoice_type: string;
  remarks: string;
  subtotal: string;
  p_and_p: string;
  discount: string;
  grand_total: string;
  is_free_delivery: boolean;
  is_collection_only: boolean;
  is_vat_exempt: boolean;
  created_at: string;
  updated_at: string;
  enquiry_item: EnquiryItem;
}

export interface Quotation {
  id: string;
  enquiry_id: string;
  seller_id: string;
  notes: string;
  total_price: string;
  created_at: string;
  updated_at: string;
  seller: Seller;
  enquiry: Enquiry;
  quotation_items: QuotationItem[];
}

interface QuotationState {
  quotations: Quotation[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: QuotationState = {
  quotations: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};


export const fetchQuotations = createAsyncThunk(
  'admin/quotations/fetchQuotations',
  async (params: any) => {
    const response = await quotationApi.getAllQuotations(params);
    return response.data;
  }
);

export const updateQuotationStatus = createAsyncThunk(
  'admin/quotations/updateStatus',
  async ({ quotationId, data }: { quotationId: string; data: any }) => {
    const response = await quotationApi.updateQuotationStatus(quotationId, data);
    return response.data;
  }
);

const quotationSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quotations';
      })
      .addCase(updateQuotationStatus.fulfilled, (state, action) => {
        const updatedQuotation = action.payload.data;
        const index = state.quotations.findIndex(q => q.id === updatedQuotation.id);
        if (index !== -1) {
          state.quotations[index] = updatedQuotation;
        }
      });
  },
});

export default quotationSlice.reducer;