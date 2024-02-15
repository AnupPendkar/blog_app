import axios, { AxiosInstance } from 'axios';
import { createReducer } from '@reduxjs/toolkit';
import { axiosState } from '@models/redux';
import { makeRequest } from '@redux/thunks/axiosRequestThunk';
import { initRequestInterceptor } from '@interceptors/request.interceptor';
import { initResponseInterceptor } from '@interceptors/response.interceptor';
import { setHttpErrDetails, setLoaderVisibility, setLoading } from '@redux/actions/httpActions';

let axiosInstance: AxiosInstance;

/**
 * Intializes both request and response interceptors.
 */
function initAxiosInterceptors() {
  initRequestInterceptor();
  initResponseInterceptor();
}

/**
 * Creates the axios instance, which can be used as base for all api requests made.
 * @param baseUrl
 */
function createAxiosInsFromBaseUrl(baseUrl: string) {
  axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
  });

  initAxiosInterceptors();
}

/**
 * Initial reducer states.
 */
const initialState: axiosState = {
  loading: false,
  loaderVisibility: true,
  error: false,
};

/**
 * Creating the reducer and listening to all it's actions.
 */
const axiosReducer = createReducer(initialState, (actions) => {
  actions
    .addCase(setHttpErrDetails, (state, action) => {
      state.httpErrDetails = action.payload;
    })

    .addCase(setLoaderVisibility, (state, action) => {
      state.loaderVisibility = action.payload;
    })

    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
      state.loaderVisibility = true;
    })

    // Thunk actions
    .addCase(makeRequest.pending, (state) => {
      state.loading = true;
      state.error = false;
    })

    .addCase(makeRequest.fulfilled, (state) => {
      state.error = false;
    })

    .addCase(makeRequest.rejected, (state) => {
      state.error = true;
    });
});

export { createAxiosInsFromBaseUrl };
export { axiosInstance };
export default axiosReducer;
