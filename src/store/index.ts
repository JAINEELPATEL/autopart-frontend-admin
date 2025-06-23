import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import enquiryReducer from './slices/enquirySlice';
import quotationReducer from './slices/quotationSlice';
import feedbackReducer from './slices/feedbackSlice';
import conversationReducer from './slices/conversationSlice';
import dashboardReducer from './slices/dashboardSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    enquiries: enquiryReducer,
    quotations: quotationReducer,
    feedback: feedbackReducer,
    conversations: conversationReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// import userReducer from './slices/userSlice';
// import enquiryReducer from './slices/enquirySlice';
// import quotationReducer from './slices/quotationSlice';
// import feedbackReducer from './slices/feedbackSlice';
// import conversationReducer from './slices/conversationSlice';
// import dashboardReducer from './slices/dashboardSlice';
// import authReducer from './slices/authSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   // You can choose to blacklist or whitelist specific reducers
//   // blacklist: ['dashboard'] // dashboard will not be persisted
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   users: userReducer,
//   enquiries: enquiryReducer,
//   quotations: quotationReducer,
//   feedback: feedbackReducer,
//   conversations: conversationReducer,
//   dashboard: dashboardReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;