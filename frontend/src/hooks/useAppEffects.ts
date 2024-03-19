import { isPropEmpty } from '@shared/utilfunctions';
import React, { useEffect } from 'react';
import useAuthMethods from './useAuthMethods';
import { useAppDispatch, useAppSelector } from '@redux/store';
import useSocket from './useSocket';
import { UseSocket } from '@models/common';
import StorageHandler from '@shared/storageHandler';
import UserService from '@services/userService';
import { setUserInfo } from '@redux/actions/userInfoActions';

const useAppEffects = () => {
  const { setUserLoginData } = useAuthMethods();
  const { userLoggedIn } = useAppSelector((state) => state.user);
  // const socket: UseSocket = useSocket();
  const { fetchUserInfo } = UserService();
  const dispatch = useAppDispatch();

  async function getUserInfo() {
    const res = await fetchUserInfo();
    dispatch(setUserInfo(res));
  }
  const storageHandler = new StorageHandler();

  // On user logged in, connect to all socket namespace events.
  useEffect(() => {
    if (userLoggedIn) {
      // socket.connect();
      getUserInfo();
    }
  }, [userLoggedIn]);

  // On browser refresh, if token values are present then keep user logged in.
  useEffect(() => {
    const accessToken = storageHandler.jwtAccesToken;
    const refreshToken = storageHandler.jwtRefreshToken;

    if (!isPropEmpty(accessToken) && !isPropEmpty(refreshToken)) {
      setUserLoginData(accessToken as string, refreshToken as string);
    }
  }, []);
};

export default useAppEffects;
