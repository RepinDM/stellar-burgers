import { FC } from 'react';

import styles from './feed.module.css';

import { TOrder } from '@utils-types';
import { Button } from '@zlden/react-developer-burger-ui-components';
import { OrdersList, FeedInfo } from '@components';

type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  isLoading: boolean;
};

export const FeedUI: FC<FeedUIProps> = ({
  orders,
  handleGetFeeds,
  isLoading
}) => (
  <main className={styles.main}>
    <section className={styles.sectionLeft}>
      <div className={styles.header}>
        <h1 className={`text text_type_main-large ${styles.title}`}>
          Лента заказов
        </h1>
        <div className={styles.refreshAction}>
          <Button
            htmlType='button'
            type='secondary'
            size='medium'
            onClick={handleGetFeeds}
            disabled={isLoading}
          >
            <span className={styles.refreshButton}>
              <svg
                className={styles.refreshIcon}
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  d='M21 12a9 9 0 1 1-3-6.708'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M21 3v6h-6'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Обновить
            </span>
          </Button>
        </div>
      </div>
      {!isLoading && orders.length === 0 ? (
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
