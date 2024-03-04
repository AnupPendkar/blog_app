import useHttp from '@hooks/useHttp';
import useSharedEssentials from '@hooks/useSharedEssentials';
import { ILoginParams, ILoginRes, IUserDetailsAPI } from '@models/user_service_model';
import React from 'react';

const UserService = () => {
  const http = useHttp();
  const { handleErr } = useSharedEssentials();

  /**
   * Posts the user login details.
   * @param params
   * @returns
   */
  function submitLoginDetails(params: ILoginParams): Promise<ILoginRes> {
    return new Promise(async (resolve) => {
      const res = await http.request('post', '/login', '', params);

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function registerUser(params) {
    return new Promise(async (resolve) => {
      const res = await http.request('post', '/register', '', params);

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  function uploadImg(file): Promise<{ path: string }> {
    return new Promise(async (resolve) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', 'image_upload');

      const res = await http.request('post', '/upload_file', '', formData, {
        'content-type': 'multipart/form-data',
      });

      if (res?.status === 200) {
        resolve(res?.data);
      }
    });
  }

  function fetchUserDetails(id: number): Promise<IUserDetailsAPI> {
    return new Promise(async (resolve) => {
      const res = await http.request('get', '/user-details', { id });

      if (res?.status === 200) {
        resolve(res?.data);
      } else {
        handleErr(res);
      }
    });
  }

  return { submitLoginDetails, uploadImg, registerUser, fetchUserDetails };
};

export default UserService;
