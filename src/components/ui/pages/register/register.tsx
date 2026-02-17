import {
  Button,
  EmailInput,
  Input
} from '@zlden/react-developer-burger-ui-components';
import { FC, SyntheticEvent } from 'react';

import styles from '../common.module.css';

type RegisterUIProps = {
  errorText?: string;
  userName: string;
  setUserName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  userName,
  setUserName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit
}) => (
  <div className={styles.container}>
    <div className={styles.wrapCenter}>
      <h2 className={`${styles.title} text text_type_main-medium mb-6`}>
        Регистрация
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type='text'
          placeholder='Имя'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(e.target.value)
          }
          value={userName}
          name='name'
          extraClass='mb-6'
        />
        <EmailInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
          name='email'
          isIcon={false}
          extraClass='mb-6'
        />
        <Input
          type='password'
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
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </div>
  </div>
);
