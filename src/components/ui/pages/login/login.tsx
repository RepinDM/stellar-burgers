import {
  Button,
  EmailInput,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import { FC, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from '../common.module.css';

type LoginUIProps = {
  errorText?: string;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export const LoginUI: FC<LoginUIProps> = ({
  errorText,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit
}) => (
  <div className={styles.container}>
    <div className={styles.wrapCenter}>
      <h2 className={`${styles.title} text text_type_main-medium mb-6`}>
        Вход
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
          name='email'
          isIcon={false}
          extraClass='mb-6'
        />
        <PasswordInput
          placeholder='Пароль'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          value={password}
          name='password'
          extraClass='mb-6'
        />

        {errorText ? (
          <p className={`${styles.error} text text_type_main-default mb-4`}>
            {errorText}
          </p>
        ) : null}

        <div className={styles.button}>
          <Button htmlType='submit' type='primary' size='medium'>
            Войти
          </Button>
        </div>
      </form>
      <p className={`text text_type_main-default mt-20 ${styles.question}`}>
        Вы — новый пользователь?{' '}
        <Link className={styles.link} to='/register'>
          Зарегистрироваться
        </Link>
      </p>
      <p className={`text text_type_main-default mt-4 ${styles.question}`}>
        Забыли пароль?{' '}
        <Link className={styles.link} to='/forgot-password'>
          Восстановить пароль
        </Link>
      </p>
    </div>
  </div>
);
