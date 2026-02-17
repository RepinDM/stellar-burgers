import { FC } from 'react';

import styles from './feed.module.css';

import { TOrder } from '@utils-types';
import { OrdersList, FeedInfo } from '@components';

type FeedUIProps = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const FeedUI: FC<FeedUIProps> = ({ orders, isLoading, error }) => (
  <main className={styles.main}>
    <section className={styles.sectionLeft}>
      <h1 className='text text_type_main-large'>Лента заказов</h1>
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
      <div className={styles.orders}>
        <OrdersList orders={orders} />
      </div>
    </section>

    <section className={styles.sectionRight}>
      <FeedInfo />
    </section>
  </main>
);
