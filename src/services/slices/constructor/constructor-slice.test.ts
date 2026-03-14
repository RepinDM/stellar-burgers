import {
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from './constructor-slice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
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
};

const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 300,
  price: 400,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauceIngredient: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('constructor slice reducer', () => {
  it('adds ingredients to the constructor', () => {
    const stateWithBun = constructorReducer(undefined, addIngredient(bun));
    const stateWithFilling = constructorReducer(
      stateWithBun,
      addIngredient(mainIngredient)
    );

    expect(stateWithBun.bun?._id).toBe(bun._id);
    expect(stateWithFilling.ingredients).toHaveLength(1);
    expect(stateWithFilling.ingredients[0]).toMatchObject({
      _id: mainIngredient._id,
      name: mainIngredient.name
    });
    expect(stateWithFilling.ingredients[0].id).toEqual(expect.any(String));
  });

  it('removes an ingredient by id', () => {
    const state = constructorReducer(
      constructorReducer(undefined, addIngredient(mainIngredient)),
      addIngredient(sauceIngredient)
    );

    const ingredientToRemove = state.ingredients[0].id;
    const nextState = constructorReducer(
      state,
      removeIngredient(ingredientToRemove)
    );

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]._id).toBe(sauceIngredient._id);
  });

  it('changes the order of fillings', () => {
    const state = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'item-1' },
        { ...sauceIngredient, id: 'item-2' }
      ]
    };

    const nextState = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(nextState.ingredients.map((item) => item.id)).toEqual([
      'item-2',
      'item-1'
    ]);
  });
});
