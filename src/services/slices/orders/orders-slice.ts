import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import {
  ordersWsClose,
  ordersWsConnecting,
  ordersWsError,
  ordersWsMessage,
  ordersWsOpen
} from '../../ws/ws-actions';

type OrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  status: 'offline' | 'connecting' | 'online';
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  status: 'offline',
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch {
      return rejectWithValue('Ошибка загрузки заказов пользователя');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Ошибка загрузки заказов';
      })
      .addCase(ordersWsConnecting, (state) => {
        state.status = 'connecting';
        state.error = null;
      })
      .addCase(ordersWsOpen, (state) => {
        state.status = 'online';
        state.error = null;
      })
      .addCase(ordersWsClose, (state) => {
        state.status = 'offline';
      })
      .addCase(ordersWsError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(ordersWsMessage, (state, action: PayloadAction<unknown>) => {
        const payload = action.payload as { orders?: TOrder[] } | null;

        if (!payload || !Array.isArray(payload.orders)) return;
        state.orders = payload.orders;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
