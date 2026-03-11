import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware
} from '@reduxjs/toolkit';
import { refreshToken } from '@api';
import { getCookie } from '../../utils/cookie';

type WSActionTypes = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsConnecting: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;
  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<unknown>;
};

const getJwtPayload = (rawToken: string): { exp?: number } | null => {
  const token = rawToken.replace(/^Bearer\s+/i, '');
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isTokenExpired = (rawToken: string, skewMs = 10000) => {
  const payload = getJwtPayload(rawToken);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewMs;
};

const getFreshSocketUrl = async (url: string) => {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('token')) return url;

    let accessToken = getCookie('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');
    const shouldRefresh =
      (!accessToken && refreshTokenValue) ||
      (!!accessToken && isTokenExpired(accessToken) && refreshTokenValue);

    if (shouldRefresh) {
      try {
        await refreshToken();
        accessToken = getCookie('accessToken');
      } catch {
        return url;
      }
    }

    if (!accessToken) return url;
    const token = accessToken.replace(/^Bearer\s+/i, '');
    parsed.searchParams.set('token', token);
    return parsed.toString();
  } catch {
    return url;
  }
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
        socket.onerror = () => {
          const message = navigator.onLine
            ? 'Ошибка WebSocket'
            : 'Нет интернет-соединения';
          dispatch(actions.wsError(message));
        };
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
              void (async () => {
                const nextUrl = await getFreshSocketUrl(lastUrl as string);
                dispatch(actions.wsConnect(nextUrl));
              })();
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
