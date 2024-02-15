import { MessageBoxProps } from '@models/common';
import { createAction } from '@reduxjs/toolkit';

// Notfication reducer actions.
export const setMessageDialogDetails = createAction<MessageBoxProps>('SHOW_MESSAGE_BOX');
