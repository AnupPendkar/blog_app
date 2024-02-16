import React from 'react';
import { HttpResponse, MessageBoxProps } from '@models/common';
import { setHttpErrDetails } from '@redux/actions/httpActions';
import { useAppDispatch } from '@redux/store';
import { setMessageDialogDetails } from '@redux/actions/notificationActions';

const useSharedEssentials = () => {
  const dispatch = useAppDispatch();

  /**
   * Common function to handle the api request error.
   * @param err
   */
  function handleErr(err: HttpResponse) {
    dispatch(
      setHttpErrDetails({
        statusCode: err?.status,
        preview: err?.data,
      })
    );
  }

  /**
   * Common function to show show message on api request made.
   * @param prop
   */
  function showMessageBox(prop: MessageBoxProps) {
    dispatch(setMessageDialogDetails(prop));
  }

  return { handleErr, showMessageBox };
};

export default useSharedEssentials;
