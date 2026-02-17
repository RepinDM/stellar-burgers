import { FC } from 'react';

import styles from './feed.module.css';

import { TOrder } from '@utils-types';
import { Button } from '@zlden/react-developer-burger-ui-components';
import { OrdersList, FeedInfo } from '@components';

type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  wsStatus: 'offline' | 'connecting' | 'online';
  isLoading: boolean;
  error: string | null;
};

const getStatusText = (status: FeedUIProps['wsStatus']) => {
  if (status === 'online') return 'Онлайн';
  if (status === 'connecting') return 'Подключение...';
  return 'Оффлайн';
};

export const FeedUI: FC<FeedUIProps> = ({
  orders,
  handleGetFeeds,
  wsStatus,
  isLoading,
  error
}) => (
  <main className={styles.main}>
    <section className={styles.sectionLeft}>
      <div className={styles.header}>
        <h1 className='text text_type_main-large'>Лента заказов</h1>
        <span
          className={`${styles.status} ${
            wsStatus === 'online' ? styles.status_online : ''
          }`}
        >
          {getStatusText(wsStatus)}
        </span>
        <Button
          htmlType='button'
          type='secondary'
          size='medium'
          onClick={handleGetFeeds}
          disabled={isLoading}
        >
          Обновить
        </Button>
      </div>
      {error ? (
        <p className='text text_type_main-default text_color_inactive'>
          {error}
        </p>
      ) : null}
      {!error && !isLoading && orders.length === 0 ? (
        <p className='text text_type_main-default text_color_inactive'>
          Заказы пока не поступали
        </p>
      ) : null}
      <OrdersList orders={orders} />
    </section>

    <section className={styles.sectionRight}>
      <FeedInfo />
    </section>
  </main>
);
