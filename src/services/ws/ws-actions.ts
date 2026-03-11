import { createAction } from '@reduxjs/toolkit';

export const feedWsConnect = createAction<string>('feed/wsConnect');
export const feedWsDisconnect = createAction('feed/wsDisconnect');
export const feedWsConnecting = createAction('feed/wsConnecting');
export const feedWsOpen = createAction('feed/wsOpen');
export const feedWsClose = createAction('feed/wsClose');
export const feedWsError = createAction<string>('feed/wsError');
export const feedWsMessage = createAction<unknown>('feed/wsMessage');

export const ordersWsConnect = createAction<string>('orders/wsConnect');
export const ordersWsDisconnect = createAction('orders/wsDisconnect');
export const ordersWsConnecting = createAction('orders/wsConnecting');
export const ordersWsOpen = createAction('orders/wsOpen');
export const ordersWsClose = createAction('orders/wsClose');
export const ordersWsError = createAction<string>('orders/wsError');
export const ordersWsMessage = createAction<unknown>('orders/wsMessage');
