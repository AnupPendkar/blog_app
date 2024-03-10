import MessageBox from '@components/message-box/MessageBox';
import { IMessageBoxEmitter, MessageBoxProps, MessageBoxTypeEnum } from '@models/common';
import { setMessageDialogDetails } from '@redux/actions/notificationActions';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { isPropEmpty } from '@shared/utilfunctions';
import React, { useEffect, useState } from 'react';
import Header from '@components/header/Header';

const MessageDialog = () => {
  const [showMessageDialog, setMessageDialogVisibility] = useState(false);
  const { messageDialogDetails } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  function onConfirmClick(data: IMessageBoxEmitter) {
    setMessageDialogVisibility(false);
    dispatch(setMessageDialogDetails(null));
  }

  /**
   * On MessageBoxProps local state change fire this effect and show message dialog
   * @deps {MessageBoxProps} messageDialogDetails
   */
  useEffect(() => {
    if (!isPropEmpty(messageDialogDetails)) {
      setMessageDialogVisibility(true);
    }
  }, [messageDialogDetails]);

  return <>{showMessageDialog && <MessageBox dialogDetails={messageDialogDetails} confirmBtnEmitter={onConfirmClick}></MessageBox>}</>;
};

export default MessageDialog;
