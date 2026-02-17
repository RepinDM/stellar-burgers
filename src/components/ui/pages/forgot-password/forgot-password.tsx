import {
  Button,
  EmailInput
} from '@zlden/react-developer-burger-ui-components';
import { FC, SyntheticEvent } from 'react';

import styles from '../common.module.css';

type ForgotPasswordUIProps = {
  errorText?: string;
  email: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};

export const ForgotPasswordUI: FC<ForgotPasswordUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit
}) => (
  <div className={styles.container}>
    <div className={styles.wrapCenter}>
      <h2 className={`${styles.title} text text_type_main-medium mb-6`}>
        Восстановление пароля
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

        {errorText ? (
          <p className={`${styles.error} text text_type_main-default mb-4`}>
            {errorText}
          </p>
        ) : null}

        <div className={styles.button}>
          <Button htmlType='submit' type='primary' size='medium'>
            Восстановить
          </Button>
        </div>
      </form>
    </div>
  </div>
);
