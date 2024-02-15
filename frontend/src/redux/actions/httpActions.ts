import { IHttpErrDetails } from '@models/common';
import { createAction } from '@reduxjs/toolkit';

// Http reducer actions.
export const setHttpErrDetails = createAction<IHttpErrDetails>('HTTP_ERROR');
export const setLoaderVisibility = createAction<boolean>('LOADER_VISIBILITY');
export const setLoading = createAction<boolean>('SET_LOADING');
