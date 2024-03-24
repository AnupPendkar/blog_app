import MessageBox from '@components/message-box/MessageBox';
import { IMessageBoxEmitter, MessageBoxProps, MessageBoxTypeEnum } from '@models/common';
import { setHttpErrDetails } from '@redux/actions/httpActions';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { isPropEmpty } from '@shared/utilfunctions';
import React, { useEffect, useState } from 'react';

const ErrorDialog = () => {
  const [showErrorDialog, setErrorDialogVisibility] = useState(false);
  const [dialogDetails, setDialogDetails] = useState<MessageBoxProps>();
  const { httpErrDetails } = useAppSelector((state) => state.http);
  const dispatch = useAppDispatch();

  /**
   * On confirm button click in error dialog, close the dialog and set the reducer state.
   * @param {IMessageBoxEmitter} data
   */
  function onConfirmClick(data: IMessageBoxEmitter) {
    setErrorDialogVisibility(false);
    dispatch(setHttpErrDetails({}));
  }

  /**
   * Constructs the error dialog props.
   */
  function constructErrDialogProp() {
    setDialogDetails({
      type: MessageBoxTypeEnum.MESSAGE_BOX,
      title: 'Oops!',
      content: `Something went wrong!`,
    });
  }

  /**
   * On httpErr reducer state change, fire this effect and show error dialog.
   * @deps {IHttpErrDetails} httpErrDetails
   */
  useEffect(() => {
    if (!isPropEmpty(httpErrDetails)) {
      setErrorDialogVisibility(true);
      constructErrDialogProp();
    }
  }, [httpErrDetails]);

  return <>{showErrorDialog && <MessageBox dialogDetails={dialogDetails} confirmBtnEmitter={onConfirmClick}></MessageBox>}</>;
};

export default ErrorDialog;
