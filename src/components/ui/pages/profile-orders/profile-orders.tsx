import { FC } from 'react';

import styles from './profile-orders.module.css';
import { TOrder } from '@utils-types';
import { OrdersList, ProfileMenu } from '@components';

type ProfileOrdersUIProps = {
  orders: TOrder[];
  wsStatus: 'offline' | 'connecting' | 'online';
  error: string | null;
};

const getStatusText = (status: ProfileOrdersUIProps['wsStatus']) => {
  if (status === 'online') return 'Онлайн';
  if (status === 'connecting') return 'Подключение...';
  return 'Оффлайн';
};

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  wsStatus,
  error
}) => (
  <main className={styles.main}>
    <aside className={styles.menu}>
      <ProfileMenu />
    </aside>

    <section className={styles.content}>
      <span
        className={`${styles.status} ${
          wsStatus === 'online' ? styles.status_online : ''
        }`}
      >
        {getStatusText(wsStatus)}
      </span>
      {error ? (
        <p className='text text_type_main-default text_color_inactive'>
          {error}
        </p>
      ) : null}
      {!error && orders.length === 0 && wsStatus !== 'connecting' ? (
        <p className='text text_type_main-default text_color_inactive'>
          Заказов пока нет
        </p>
      ) : null}
      <OrdersList orders={orders} />
    </section>
  </main>
);
