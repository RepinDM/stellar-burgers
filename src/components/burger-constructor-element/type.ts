import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  onMoveIngredient: (fromIndex: number, toIndex: number) => void;
  onRemoveIngredient: (uuid: string) => void;
};
