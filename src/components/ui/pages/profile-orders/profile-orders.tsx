import { FC } from 'react';

import styles from './profile-orders.module.css';
import { TOrder } from '@utils-types';
import { OrdersList, ProfileMenu } from '@components';

type ProfileOrdersUIProps = {
  orders: TOrder[];
  wsStatus: 'offline' | 'connecting' | 'online';
};

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  wsStatus
}) => (
  <main className={styles.main}>
    <aside className={styles.menu}>
      <ProfileMenu />
    </aside>

    <section className={styles.content}>
      {orders.length === 0 && wsStatus !== 'connecting' ? (
        <p className='text text_type_main-default text_color_inactive'>
          Заказов пока нет
        </p>
      ) : null}
      <div className={styles.orders}>
        <OrdersList orders={orders} />
      </div>
    </section>
  </main>
);
