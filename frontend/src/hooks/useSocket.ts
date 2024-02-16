import * as socketIo from 'socket.io-client';
import { AppWebSocketNSPEnum, ISocketClient, UseSocket, WSEventNameEnum } from '@models/common';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { environment } from '@environment/environment';
import { userSocketConnection } from '@redux/actions/userInfoActions';
import StorageHandler from '@shared/storageHandler';
import { isPropEmpty } from '@shared/utilfunctions';
import { useRef } from 'react';
import { AppSolutionRegistry } from '@shared/appSolutionsRegistry';

const useSocket = (): UseSocket => {
  const storageHandler = new StorageHandler();
  const baseUrl = new URL(storageHandler.activeBaseUrl as string) ?? new URL(environment.baseUrl as string);

  const { parsedUserInfo } = useAppSelector((state) => state?.user);
  const socketUrl = `${baseUrl.href}${AppSolutionRegistry.webSocketNamespace}`;
  const socketioClients = useRef<Array<ISocketClient>>([]);
  const dispatch = useAppDispatch();

  function isAllSocketsConnected() {
    return !isPropEmpty(socketioClients?.current) && socketioClients?.current.filter((socket) => socket?.socket?.connected === false)?.length <= 0;
  }

  function onConnectionError() {
    dispatch(userSocketConnection(false));
  }

  function onConnectionFailed() {
    dispatch(userSocketConnection(false));
  }

  function disconnectSocketConnections() {
    dispatch(userSocketConnection(false));
    socketioClients?.current?.forEach((socket) => {
      socket?.socket?.disconnect();
    });
  }

  function initSocketConnection(): void {
    disconnectSocketConnections();

    const socket = socketIo.connect(socketUrl, {
      transports: ['websocket'],
    });

    socket.on(WSEventNameEnum.CONNECTION_ERROR, onConnectionError);
    socket.on(WSEventNameEnum.CONNECTION_FAILED, onConnectionFailed);
    socket.on(WSEventNameEnum.DISCONNECT, () => dispatch(userSocketConnection(false)));
    socket.on(WSEventNameEnum.CONNECT, () => {
      AppSolutionRegistry.websocketEvents.forEach((event) => {
        socket.on(event, (response: any) => {
          console.log(event, response);
        });
      });

      // join into a socketio namespace room by the current login username.
      socket.emit(
        'join',
        {
          username: parsedUserInfo?.username,
          token: parsedUserInfo?.token,
        },
        (response: any) => {
          // 401 is agreed by server to be an authentication failure signal.
          if (response === 401) {
            console.error('Server reported invalid authentication, cannot proceed with enabling socket connections.');
            disconnectSocketConnections();
          }
        }
      );

      socketioClients?.current.push({
        namespace: AppSolutionRegistry.webSocketNamespace,
        socket: socket,
      });

      if (isAllSocketsConnected()) {
        dispatch(userSocketConnection(true));
      }
      console.log({
        'Connected socket namespaces': socketioClients?.current?.map((nsp) => `${baseUrl}${nsp?.namespace}`),
      });
    });
  }

  return {
    connect: initSocketConnection,
    disconnect: disconnectSocketConnections,
  };
};

export default useSocket;
