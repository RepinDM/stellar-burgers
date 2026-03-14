import { ingredientsReducer, fetchIngredients } from './ingredients-slice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  }
];

describe('ingredients slice reducer', () => {
  it('sets isLoading to true on request', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores ingredients and resets isLoading on success', () => {
    const pendingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );
    const state = ingredientsReducer(
      pendingState,
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(ingredients);
    expect(state.error).toBeNull();
  });

  it('stores error and resets isLoading on failure', () => {
    const pendingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );
    const state = ingredientsReducer(
      pendingState,
      fetchIngredients.rejected(
        new Error('Ошибка загрузки ингредиентов'),
        'request-id',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
