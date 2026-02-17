import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/slices/user/user-slice';
import { fetchIngredients } from '../../services/slices/ingredients/ingredients-slice';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors/ingredients';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

type LocationState = {
  background?: Location;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const state = location.state as LocationState | null;

  const backgroundLocation = state?.background;

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!ingredientsLoading && ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsLoading, ingredients.length]);

  const handleCloseModal = () => {
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname, { replace: true });
      return;
    }
    navigate('/');
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные страницы */}
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* гостевые роуты */}
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        {/* защищённые роуты */}
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        {/* страницы деталей при прямом переходе */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки (когда есть background) */}
      {backgroundLocation ? (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      ) : null}
    </div>
  );
};

export default App;
