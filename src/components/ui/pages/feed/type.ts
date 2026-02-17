import { TOrder } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};
