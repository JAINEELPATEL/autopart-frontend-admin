import { feedbackApi } from './../services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface FeedbackMessage {
  id: string;
  message: string;
  screenshot_url: string[] | null;
  is_admin: boolean;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

interface Feedback {
  id: string;
  status: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  messages: FeedbackMessage[];
}

interface FeedbackState {
  feedbacks: Feedback[];
  currentMessages: FeedbackMessage[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: FeedbackState = {
  feedbacks: [],
  currentMessages: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchFeedbacks = createAsyncThunk(
  'admin/feedbacks/fetchFeedbacks',
  async (params: any) => {
    const response = await feedbackApi.getAllFeedback(params);
    return response.data;
  }
);

export const fetchFeedbackMessages = createAsyncThunk(
  'admin/feedbacks/fetchMessages',
  async (feedbackId: string) => {
    const response = await feedbackApi.getFeedbackMessages(feedbackId);
    return response.data;
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'admin/feedbacks/updateStatus',
  async ({ feedbackId, data }: { feedbackId: string; data: any }) => {
    const response = await feedbackApi.updateFeedbackStatus(feedbackId, data);
    return response.data;
  }
);

export const replyToFeedback = createAsyncThunk(
  'admin/feedbacks/reply',
  async ({ feedbackId, data }: { feedbackId: string; data: any }) => {
    const response = await feedbackApi.replyToFeedback(feedbackId, data);
    return response.data;
  }
);

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {
    clearCurrentMessages: (state) => {
      state.currentMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.currentPage,
          pages: action.payload.totalPages,
        };
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feedbacks';
      })
      .addCase(fetchFeedbackMessages.fulfilled, (state, action) => {
        state.currentMessages = action.payload.data;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const updatedFeedback = action.payload.data;
        const index = state.feedbacks.findIndex(f => f.id === updatedFeedback.id);
        if (index !== -1) {
          state.feedbacks[index] = updatedFeedback;
        }
      })
      .addCase(replyToFeedback.fulfilled, (state, action) => {
        // Add the new message to current messages
        state.currentMessages.push(action.payload.data);
        // Update the feedback in the list to reflect the new message
        const feedbackIndex = state.feedbacks.findIndex(f => f.id === action.payload.data.feedback_id);
        if (feedbackIndex !== -1) {
          state.feedbacks[feedbackIndex].messages.push(action.payload.data);
        }
      });
  },
});

export const { clearCurrentMessages } = feedbackSlice.actions;
export default feedbackSlice.reducer;