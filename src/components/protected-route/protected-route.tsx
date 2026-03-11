import { FC, ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors/user';

type ProtectedRouteProps = {
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

  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
