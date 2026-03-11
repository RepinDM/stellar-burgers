import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { createSocketMiddleware } from './middleware/socket-middleware';
import {
  feedWsClose,
  feedWsConnect,
  feedWsConnecting,
  feedWsDisconnect,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
  ordersWsClose,
  ordersWsConnect,
  ordersWsConnecting,
  ordersWsDisconnect,
  ordersWsError,
  ordersWsMessage,
  ordersWsOpen
} from './ws/ws-actions';

const feedSocketMiddleware = createSocketMiddleware({
  wsConnect: feedWsConnect,
  wsDisconnect: feedWsDisconnect,
  wsConnecting: feedWsConnecting,
  wsOpen: feedWsOpen,
  wsClose: feedWsClose,
  wsError: feedWsError,
  wsMessage: feedWsMessage
});

const ordersSocketMiddleware = createSocketMiddleware({
  wsConnect: ordersWsConnect,
  wsDisconnect: ordersWsDisconnect,
  wsConnecting: ordersWsConnecting,
  wsOpen: ordersWsOpen,
  wsClose: ordersWsClose,
  wsError: ordersWsError,
  wsMessage: ordersWsMessage
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(feedSocketMiddleware, ordersSocketMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
