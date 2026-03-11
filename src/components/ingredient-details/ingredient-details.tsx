import { FC } from 'react';
import { Location, useLocation, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector } from '../../services/store';
import { selectIngredientById } from '../../services/selectors/ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const ingredientData = useSelector(selectIngredientById(id));

  if (!ingredientData) {
    return <Preloader />;
  }

  const isModal = Boolean(
    (location.state as { background?: Location })?.background
  );

  return (
    <IngredientDetailsUI ingredientData={ingredientData} isModal={isModal} />
  );
};
