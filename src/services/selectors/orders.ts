import { RootState } from '../store';

export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.isLoading;
export const selectUserOrdersError = (state: RootState) => state.orders.error;
export const selectUserOrdersStatus = (state: RootState) => state.orders.status;
