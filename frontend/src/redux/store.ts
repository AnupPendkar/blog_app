import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import axiosReducer from './reducers/axiosReducer';
import userReducer from './reducers/userInfoReducer';
import notificationReducer from './reducers/notificationReducer';

/**
 * Configuring all the store reducers.
 */
export const store = configureStore({
  reducer: {
    http: axiosReducer,
    user: userReducer,
    notification: notificationReducer,
  },
  devTools: true, // Used to show reducer state info in Redux Devtools
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector<RootState>;
