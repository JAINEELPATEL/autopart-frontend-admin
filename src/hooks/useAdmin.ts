import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchUsers,
  updateUserStatus,
  verifySeller,
} from '../store/slices/userSlice';
import {
  fetchEnquiries,
  fetchQuotationsByEnquiry,
} from '../store/slices/enquirySlice';
import {
  fetchQuotations,
  updateQuotationStatus,
} from '../store/slices/quotationSlice';
import {
  fetchFeedbacks,
  updateFeedbackStatus,
  replyToFeedback,
  fetchFeedbackMessages,
  clearCurrentMessages,
} from '../store/slices/feedbackSlice';
import {
  fetchConversations,
  fetchMessagesBetween,
} from '../store/slices/conversationSlice';

// Custom typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => 
  useSelector<RootState, T>(selector);

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, pagination } = useAppSelector(
    (state: RootState) => state.users
  );

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers: (params: any) => dispatch(fetchUsers(params) as any),
    updateUserStatus: (userId: string, data: any) =>
      dispatch(updateUserStatus({ userId, data }) as any),
    verifySeller: (userId: string) => dispatch(verifySeller(userId) as any),
  };
};

export const useEnquiries = () => {
  const dispatch = useDispatch();
  const { enquiries, loading, error, pagination } = useSelector(
    (state: RootState) => state.enquiries
  );

  return {
    enquiries,
    loading,
    error,
    pagination,
    fetchEnquiries: (params: any) => dispatch(fetchEnquiries(params) as any),
    fetchQuotationsByEnquiry: (enquiryId: string) =>
      dispatch(fetchQuotationsByEnquiry(enquiryId) as any),
  };
};

export const useQuotations = () => {
  const dispatch = useDispatch();
  const { quotations, loading, error, pagination } = useSelector(
    (state: RootState) => state.quotations
  );

  return {
    quotations,
    loading,
    error,
    pagination,
    fetchQuotations: (params: any) => dispatch(fetchQuotations(params) as any),
    updateQuotationStatus: (quotationId: string, data: any) =>
      dispatch(updateQuotationStatus({ quotationId, data }) as any),
  };
};

export const useFeedbacks = () => {
    const dispatch = useDispatch();
    const { feedbacks, currentMessages, loading, error, pagination } = useSelector(
      (state: RootState) => state.feedback
    );
  
    return {
      feedbacks,
      currentMessages,
      loading,
      error,
      pagination,
      fetchFeedbacks: (params: any) => dispatch(fetchFeedbacks(params) as any),
      fetchFeedbackMessages: (feedbackId: string) => 
        dispatch(fetchFeedbackMessages(feedbackId) as any),
      updateFeedbackStatus: (feedbackId: string, data: any) =>
        dispatch(updateFeedbackStatus({ feedbackId, data }) as any),
      replyToFeedback: (feedbackId: string, data: any) =>
        dispatch(replyToFeedback({ feedbackId, data }) as any),
      clearCurrentMessages: () => dispatch(clearCurrentMessages()),
    };
  };

export const useConversations = () => {
  const dispatch = useDispatch();
  const { conversations, currentMessages, loading, error, pagination } = useSelector(
    (state: RootState) => state.conversations
  );

  return {
    conversations,
    currentMessages,
    loading,
    error,
    pagination,
    fetchConversations: (params: any) => dispatch(fetchConversations(params) as any),
    fetchMessagesBetween: (buyerId: string, sellerId: string) =>
        dispatch(fetchMessagesBetween({ buyerId, sellerId }) as any),
  };
};