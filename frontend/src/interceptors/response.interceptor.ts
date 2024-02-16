import { axiosInstance } from '@redux/reducers/axiosReducer';

/**
 * Response intercept if want to intercept anything from the res we get from backed.
 */
export const initResponseInterceptor = () => {
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
