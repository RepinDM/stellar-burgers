import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/selectors/ingredients';
import {
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading
} from '../../services/selectors/order-details';
import {
  clearOrderDetails,
  fetchOrderByNumber
} from '../../services/slices/order-details/order-details-slice';
import { fetchIngredients } from '../../services/slices/ingredients/ingredients-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const orderNumber = Number(number);
  const isOrderNumberValid = Number.isFinite(orderNumber);

  const orderData = useSelector(selectOrderDetails);
  const isLoading = useSelector(selectOrderDetailsLoading);
  const orderError = useSelector(selectOrderDetailsError);
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    if (isOrderNumberValid) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, isOrderNumberValid, orderNumber]);

  useEffect(() => {
    if (!ingredientsLoading && ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsLoading, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  const errorMessage = orderError ?? ingredientsError;

  if (!isOrderNumberValid) {
    return (
      <p className='text text_type_main-default text_color_inactive'>
        Некорректный номер заказа
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className='text text_type_main-default text_color_inactive'>
        {errorMessage}
      </p>
    );
  }

  if (isLoading || ingredientsLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
