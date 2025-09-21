import { configureStore } from '@reduxjs/toolkit';
import settingReducer from './setting/reducers';
import authSliceReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    setting: settingReducer,
    auth: authSliceReducer,
  }
});