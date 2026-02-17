import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorCounts = createSelector(
  [selectConstructorItems],
  (constructorState) => {
    const { bun, ingredients } = constructorState;

    const counts: Record<string, number> = {};

    if (bun) counts[bun._id] = 2;

    for (const item of ingredients) {
      counts[item._id] = (counts[item._id] ?? 0) + 1;
    }

    return counts;
  }
);

export const selectConstructorPrice = createSelector(
  [selectConstructorItems],
  (constructorState) => {
    const { bun, ingredients } = constructorState;

    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + fillingsPrice;
  }
);
