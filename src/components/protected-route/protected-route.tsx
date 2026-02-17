import { FC, ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors/user';

type ProtectedRouteProps = {
  /**
   * Если true — маршрут доступен ТОЛЬКО гостям (не авторизованным).
   * Например: /login, /register и т.п.
   */
  onlyUnAuth?: boolean;
  element: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  element
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuth = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return null;
  }

  // Гостевой маршрут: если уже авторизован — отправляем на главную.
  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }

  // Защищённый маршрут: если не авторизован — отправляем на /login и запоминаем from.
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
