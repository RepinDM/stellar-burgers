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

const WS_PROFILE = 'wss://norma.nomoreparties.space/orders';

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

      if (!accessToken && refreshTokenValue) {
        try {
          await refreshToken();
          accessToken = getCookie('accessToken');
        } catch {
          return;
        }
      }

      const token = accessToken?.replace(/^Bearer\s+/i, '');
      if (token && isActive) {
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
