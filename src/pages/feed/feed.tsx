import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed/feed-slice';
import {
  selectFeedLoading,
  selectFeedOrders
} from '../../services/selectors/feed';
import { feedWsConnect, feedWsDisconnect } from '../../services/ws/ws-actions';

const WS_ALL = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeed());
    dispatch(feedWsConnect(WS_ALL));
    return () => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch]);

  return <FeedUI orders={orders} isLoading={isLoading} />;
};
