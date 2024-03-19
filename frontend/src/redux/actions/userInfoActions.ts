import { ParsedUserInfo, ThemePrefEnum } from '@models/common';
import { IUserInfoAPI } from '@models/user_service_model';
import { createAction } from '@reduxjs/toolkit';

// User reducer actions.
export const userActiveAction = createAction<boolean>('USER_STATUS');
export const setUserInfo = createAction<IUserInfoAPI>('USER_INFO');
export const userSocketConnection = createAction<boolean>('USER_SOCKET_CONNECTION');
export const userDetailsAction = createAction<ParsedUserInfo>('USER_DETAILS');
export const changeThemePref = createAction<ThemePrefEnum>('THEME_PREF');
