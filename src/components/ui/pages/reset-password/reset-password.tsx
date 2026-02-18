import {
  Button,
  Input,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import { FC, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from '../common.module.css';

type ResetPasswordUIProps = {
  errorText?: string;
  password: string;
  setPassword: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText,
  password,
  setPassword,
  token,
  setToken,
  handleSubmit
}) => (
  <div className={styles.container}>
    <div className={styles.wrapCenter}>
      <h2 className={`${styles.title} text text_type_main-medium mb-6`}>
        Восстановление пароля
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          placeholder='Введите новый пароль'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          value={password}
          name='password'
          extraClass='mb-6'
        />
        <Input
          type='text'
          placeholder='Введите код из письма'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setToken(e.target.value)
          }
          value={token}
          name='token'
          extraClass='mb-6'
        />

        {errorText ? (
          <p className={`${styles.error} text text_type_main-default mb-4`}>
            {errorText}
          </p>
        ) : null}

        <div className={styles.button}>
          <Button htmlType='submit' type='primary' size='medium'>
            Сохранить
          </Button>
        </div>
      </form>
      <p className={`text text_type_main-default mt-20 ${styles.question}`}>
        Вспомнили пароль?{' '}
        <Link className={styles.link} to='/login'>
          Войти
        </Link>
      </p>
    </div>
  </div>
);
