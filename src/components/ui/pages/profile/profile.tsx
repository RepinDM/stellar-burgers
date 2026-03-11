import {
  Button,
  EmailInput,
  Input
} from '@zlden/react-developer-burger-ui-components';
import { FC, FormEvent } from 'react';

import styles from './profile.module.css';
import { ProfileMenu } from '@components';

type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  handleCancel: (e: FormEvent) => void;
  handleSubmit: (e: FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  handleCancel,
  handleSubmit,
  handleInputChange
}) => (
  <main className={styles.main}>
    <aside className={styles.menu}>
      <ProfileMenu />
    </aside>

    <section className={styles.content}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type='text'
          placeholder='Имя'
          onChange={handleInputChange}
          value={formValue.name}
          name='name'
          icon='EditIcon'
          extraClass='mb-6'
        />
        <EmailInput
          onChange={handleInputChange}
          value={formValue.email}
          name='email'
          isIcon
          extraClass='mb-6'
        />
        <Input
          type='password'
          placeholder='Пароль'
          onChange={handleInputChange}
          value={formValue.password}
          name='password'
          icon='EditIcon'
          extraClass='mb-6'
        />

        {isFormChanged ? (
          <div className={styles.actions}>
            <Button
              htmlType='button'
              type='secondary'
              size='medium'
              onClick={handleCancel}
            >
              Отмена
            </Button>
            <Button htmlType='submit' type='primary' size='medium'>
              Сохранить
            </Button>
          </div>
        ) : null}
      </form>
    </section>
  </main>
);
