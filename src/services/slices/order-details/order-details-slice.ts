import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (!data?.success || !data.orders?.length) {
        return rejectWithValue('Заказ не найден');
      }
      return data.orders[0] as TOrder;
    } catch {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export const orderDetailsReducer = orderDetailsSlice.reducer;
