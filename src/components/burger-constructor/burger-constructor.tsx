import { FC, useCallback } from 'react';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorItems,
  selectConstructorPrice
} from '../../services/selectors/constructor';
import { selectIsAuthenticated } from '../../services/selectors/user';
import {
  selectOrderModalData,
  selectOrderRequest
} from '../../services/selectors/order';

import {
  createOrder,
  clearOrderModal
} from '../../services/slices/order/order-slice';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructor/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorPrice);

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const isAuth = useSelector(selectIsAuthenticated);

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', {
        state: { from: location as Location },
        replace: true
      });
      return;
    }

    dispatch(createOrder());
  }, [
    constructorItems.bun,
    orderRequest,
    isAuth,
    navigate,
    location,
    dispatch
  ]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrderModal());
  }, [dispatch]);

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeIngredient(id));
    },
    [dispatch]
  );

  const handleMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onMoveIngredient={handleMove}
      onRemoveIngredient={handleRemove}
      price={price}
    />
  );
};
