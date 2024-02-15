import { INotificationReducerState } from '@models/common';
import { setMessageDialogDetails } from '@redux/actions/notificationActions';
import { createReducer } from '@reduxjs/toolkit';

/**
 * Initial reducer state.
 */
const notificationInitialStates: INotificationReducerState = {};

/**
 * Creating the reducer and listening to all of it's actions.
 */
const notificationReducer = createReducer(notificationInitialStates, (actions) => {
  actions.addCase(setMessageDialogDetails, (state, action) => {
    state.messageDialogDetails = action?.payload;
  });
});

export default notificationReducer;
