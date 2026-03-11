import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients/ingredients-slice';
import { constructorReducer } from './slices/constructor/constructor-slice';
import { userReducer } from './slices/user/user-slice';
import { orderReducer } from './slices/order/order-slice';
import { feedReducer } from './slices/feed/feed-slice';
import { ordersReducer } from './slices/orders/orders-slice';
import { orderDetailsReducer } from './slices/order-details/order-details-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  orders: ordersReducer,
  orderDetails: orderDetailsReducer
});
