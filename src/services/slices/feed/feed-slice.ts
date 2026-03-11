import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import {
  feedWsClose,
  feedWsConnecting,
  feedWsError,
  feedWsMessage,
  feedWsOpen
} from '../../ws/ws-actions';

type FeedResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsStatus: 'offline' | 'connecting' | 'online';
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  wsStatus: 'offline'
};

export const fetchFeed = createAsyncThunk<
  FeedResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    if (!data?.success) return rejectWithValue('Не удалось загрузить ленту');
    return data as FeedResponse;
  } catch {
    return rejectWithValue('Ошибка загрузки ленты');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты';
      });

    builder
      .addCase(feedWsConnecting, (state) => {
        state.wsStatus = 'connecting';
        state.error = null;
      })
      .addCase(feedWsOpen, (state) => {
        state.wsStatus = 'online';
        state.error = null;
      })
      .addCase(feedWsClose, (state) => {
        state.wsStatus = 'offline';
      })
      .addCase(feedWsError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      })
      .addCase(feedWsMessage, (state, action: PayloadAction<unknown>) => {
        const payload = action.payload as Partial<FeedResponse> | null;

        if (!payload || !Array.isArray(payload.orders)) return;

        state.orders = payload.orders;
        state.total = payload.total ?? 0;
        state.totalToday = payload.totalToday ?? 0;
      });
  }
});

export const feedReducer = feedSlice.reducer;
