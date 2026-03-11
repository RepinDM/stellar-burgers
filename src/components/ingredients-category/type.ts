import { TIngredient } from '@utils-types';

export type TIngredientsCategoryProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  counts: Record<string, number>;
  handleAdd: (ingredient: TIngredient) => void;
};
