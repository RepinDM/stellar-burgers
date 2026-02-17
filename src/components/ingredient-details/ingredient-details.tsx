import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients/ingredients-slice';
import {
  selectIngredientById,
  selectIngredients
} from '../../services/selectors/ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = useSelector(selectIngredientById(id));

  // Если пришли по прямой ссылке, а ингредиентов ещё нет — загрузим
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
