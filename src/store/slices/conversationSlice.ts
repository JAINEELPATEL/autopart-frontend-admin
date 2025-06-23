import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { conversationApi } from '../services/api';

// Conversation list (all rooms)
interface Conversation {
  room_id: string;
  participants: {
    id: string;
    name: string;
    email: string;
    type: "buyer" | "seller";
    // role: string;
  }[];
  last_message: {
    content: string;
    date: string;
  };
  messages_count: number;
  status: string;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url: string | null;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

interface ConversationState {
  conversations: Conversation[];
  currentMessages: Message[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ConversationState = {
  conversations: [],
  currentMessages: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },
};


export const fetchConversations = createAsyncThunk(
  'admin/conversations/fetchConversations',
  async (params: any) => {
    const response = await conversationApi.getAllConversations(params);
    return response.data;
  }
);

export const fetchMessagesBetween = createAsyncThunk(
  'admin/conversations/fetchMessagesBetween',
  async ({ buyerId, sellerId }: { buyerId: string; sellerId: string }) => {
    const response = await conversationApi.getMessagesBetween(buyerId, sellerId);
    return response.data;
  }
);

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearCurrentMessages: (state) => {
      state.currentMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data;
         // Add pagination support
         if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      .addCase(fetchMessagesBetween.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesBetween.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessages = action.payload.data;
      })
      .addCase(fetchMessagesBetween.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      });
  },
});

export const { clearCurrentMessages } = conversationSlice.actions;
export default conversationSlice.reducer;