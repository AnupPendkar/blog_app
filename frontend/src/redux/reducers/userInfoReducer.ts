import { GlobalUserVariables } from '@models/redux';
import { createReducer } from '@reduxjs/toolkit';
import { changeThemePref, setUserInfo, userActiveAction, userDetailsAction, userSocketConnection } from '@redux/actions/userInfoActions';
import { ThemePrefEnum } from '@models/common';

/**
 * Initial reducer states.
 */
const globalUserVariables: GlobalUserVariables = {
  userLoggedIn: false,
  parsedUserInfo: undefined,
  isSocketConnected: false,
  themePref: ThemePrefEnum.DARK,
};

/**
 * Creating the reducer and listening to all of it's actions.
 */
const userInfoReducer = createReducer(globalUserVariables, (actions) => {
  actions
    .addCase(userActiveAction, (state, action) => {
      state.userLoggedIn = action?.payload;
    })

    .addCase(setUserInfo, (state, action) => {
      state.userInfo = action?.payload;
    })

    .addCase(userDetailsAction, (state, action) => {
      state.userLoggedIn = true;
      state.parsedUserInfo = action?.payload;
    })

    .addCase(userSocketConnection, (state, action) => {
      state.isSocketConnected = action?.payload;
    })

    .addCase(changeThemePref, (state, action) => {
      state.themePref = action?.payload;
    });
});

export default userInfoReducer;
