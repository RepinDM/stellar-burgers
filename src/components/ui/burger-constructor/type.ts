import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  onMoveIngredient: (fromIndex: number, toIndex: number) => void;
  onRemoveIngredient: (uuid: string) => void;
};
