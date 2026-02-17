import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware
} from '@reduxjs/toolkit';

type WSActionTypes = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsConnecting: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;
  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<unknown>;
};

export const createSocketMiddleware =
  (actions: WSActionTypes): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;
    let shouldClose = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let lastUrl: string | null = null;
    let isManuallyClosed = false;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const clearReconnectTimer = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    return (next) => (action: unknown) => {
      const { dispatch } = store;

      if (actions.wsConnect.match(action)) {
        const url = action.payload;
        if (
          socket &&
          lastUrl === url &&
          (socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING)
        ) {
          return next(action);
        }

        const prevUrl = lastUrl;
        const wasManuallyClosed = isManuallyClosed;
        lastUrl = url;
        isManuallyClosed = false;
        shouldClose = false;
        if (prevUrl !== url || wasManuallyClosed) {
          retryCount = 0;
        }
        clearReconnectTimer();

        if (socket) {
          if (socket.readyState === WebSocket.CONNECTING) {
            shouldClose = true;
          } else {
            socket.close();
          }
        }

        dispatch(actions.wsConnecting());
        socket = new WebSocket(url);

        socket.onopen = () => {
          if (shouldClose && socket) {
            shouldClose = false;
            socket.close();
            return;
          }
          retryCount = 0;
          dispatch(actions.wsOpen());
        };
        socket.onerror = () => dispatch(actions.wsError('WebSocket error'));
        socket.onclose = () => {
          socket = null;
          dispatch(actions.wsClose());
          if (!isManuallyClosed && lastUrl) {
            if (retryCount >= MAX_RETRIES) {
              return;
            }
            retryCount += 1;
            clearReconnectTimer();
            const delay = Math.min(3000 * retryCount, 30000);
            reconnectTimer = setTimeout(() => {
              dispatch(actions.wsConnect(lastUrl as string));
            }, delay);
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch(actions.wsMessage(data));
          } catch {
            dispatch(actions.wsError('Некорректный JSON от WebSocket'));
          }
        };
      }

      if (actions.wsDisconnect.match(action)) {
        isManuallyClosed = true;
        clearReconnectTimer();
        if (socket) {
          if (socket.readyState === WebSocket.CONNECTING) {
            shouldClose = true;
          } else {
            socket.close();
            socket = null;
          }
        }
      }

      return next(action);
    };
  };
