import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../../store';
import { clearConstructor } from '../constructor/constructor-slice';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('order/createOrder', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const { burgerConstructor } = getState();
    const bun = burgerConstructor?.bun;

    if (!bun) {
      return rejectWithValue('Не выбрана булка');
    }

    const ingredientIds = [
      bun._id,
      ...(burgerConstructor.ingredients ?? []).map((i) => i._id),
      bun._id
    ];

    const res = await orderBurgerApi(ingredientIds);

    if (!res?.success || !res.order) {
      return rejectWithValue('Не удалось оформить заказ');
    }

    dispatch(clearConstructor());

    return res.order;
  } catch (e) {
    const message =
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message?: string }).message)
        : 'Ошибка оформления заказа';

    return rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.error = action.payload ?? 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
