import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserOrders,
  selectUserOrdersError,
  selectUserOrdersStatus
} from '../../services/selectors/orders';
import {
  ordersWsConnect,
  ordersWsDisconnect
} from '../../services/ws/ws-actions';
import { getCookie } from '../../utils/cookie';
import { refreshToken } from '@api';
import { fetchUserOrders } from '../../services/slices/orders/orders-slice';

const WS_PROFILE = 'wss://norma.nomoreparties.space/orders';

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

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const error = useSelector(selectUserOrdersError);
  const wsStatus = useSelector(selectUserOrdersStatus);

  useEffect(() => {
    let isActive = true;
    const connect = async () => {
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
          return;
        }
      }

      const token = accessToken?.replace(/^Bearer\s+/i, '');
      if (token && isActive) {
        dispatch(fetchUserOrders());
        dispatch(ordersWsConnect(`${WS_PROFILE}?token=${token}`));
      }
    };

    connect();
    return () => {
      isActive = false;
      dispatch(ordersWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} wsStatus={wsStatus} error={error} />;
};
