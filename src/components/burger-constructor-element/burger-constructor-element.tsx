import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, onMoveIngredient, onRemoveIngredient }) => {
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        onMoveIngredient(index, index + 1);
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        onMoveIngredient(index, index - 1);
      }
    };

    const handleClose = () => {
      onRemoveIngredient(ingredient.id);
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
