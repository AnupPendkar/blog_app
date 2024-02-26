import { useNavigate } from 'react-router-dom';
import { HttpResponse, ReqMetaData } from '@models/common';
import { useAppDispatch } from '@redux/store';
import useAuthMethods from './useAuthMethods';
import { makeRequest } from '@redux/thunks/axiosRequestThunk';
import { setLoaderVisibility } from '@redux/actions/httpActions';

const useHttp = () => {
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logout } = useAuthMethods();
  let abortController: AbortController;

  /**
   * Common function created for all http requests and on resolve sends back payload as a promise.
   * @param method
   * @param url
   * @param params
   * @param body
   * @returns
   */
  function request(method: string, url: string, params?: any, body = {}, headers?: any): Promise<HttpResponse> {
    abortController = new AbortController();
    const signal = abortController.signal;

    return new Promise((resolve) => {
      const requestPayload: ReqMetaData = {
        method,
        url,
        params: params,
        data: body,
        signal,
      };

      appDispatch(makeRequest(requestPayload)).then((res) => {
        if ((res?.payload as HttpResponse)?.status === 401) {
          // logout();
          // navigate('/');
          return;
        }

        resolve(res?.payload as HttpResponse);
      });
    });
  }

  /**
   * Function used the abort the current running http request.
   */
  function abortRequest(): void {
    abortController?.abort();
  }

  /**
   * Used to not show loader on api request made.
   * @returns
   */
  function noLoader(): ReturnType<typeof useHttp> {
    appDispatch(setLoaderVisibility(false));
    return this;
  }

  return { request, noLoader, abortRequest };
};

export default useHttp;
