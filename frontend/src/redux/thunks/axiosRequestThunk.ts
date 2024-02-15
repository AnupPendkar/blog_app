import { HttpResponse, ReqMetaData } from '@models/common';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../reducers/axiosReducer';
import { setLoading } from '@redux/actions/httpActions';

/**
 * Async thunk to handle all the async reducer actions.
 */
export const makeRequest = createAsyncThunk('Request', async (param: ReqMetaData, _thunk) => {
  const axiosConfig = { ...param };

  // Increases the loader visibility after req fulfilled or rejected.
  const removeLoader = () => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      _thunk.dispatch(setLoading(false));
    }, 100);
  };

  // Returns the thunk payload.
  const returnPayload = (data: any, status: number, statusText: string): HttpResponse => ({ data, status, statusText });

  try {
    // If request fulfilled.
    const response = await axiosInstance(axiosConfig);
    removeLoader();

    return returnPayload(response?.data, response?.status, response?.statusText);
    // ----------------------------------------------------------------------------------
  } catch (err: any) {
    // If request rejected.
    if (err?.code === 'ERR_CANCELED') {
      // If request aborted then, directly return the payload.
      return returnPayload(null, 499, 'Request Cancelled');
    }
    removeLoader();

    return returnPayload(err?.response?.data, err?.response?.status, err?.response?.statusText);
  }
});
