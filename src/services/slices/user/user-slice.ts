import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  refreshToken,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const setAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearAuthTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message?: string }).message || fallback);
  }
  return fallback;
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    setAuthTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Ошибка регистрации'));
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    setAuthTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Ошибка авторизации'));
  }
});

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response?.success || !response.user) {
        return rejectWithValue('Не удалось получить пользователя');
      }
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка получения профиля'));
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    if (!response?.success || !response.user) {
      return rejectWithValue('Не удалось обновить профиль');
    }
    return response.user;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Ошибка обновления профиля'));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearAuthTokens();
    } catch (err) {
      clearAuthTokens();
      return rejectWithValue(getErrorMessage(err, 'Ошибка выхода'));
    }
  }
);

export const checkUserAuth = createAsyncThunk<void>(
  'user/checkAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!accessToken && !refreshTokenValue) {
      dispatch(setAuthChecked(true));
      return;
    }
    try {
      if (!accessToken && refreshTokenValue) {
        await refreshToken();
      }
      await dispatch(getUser()).unwrap();
    } catch {
      clearAuthTokens();
    } finally {
      dispatch(setAuthChecked(true));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка авторизации';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload ?? 'Ошибка получения профиля';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload ?? 'Ошибка выхода';
        state.isAuthChecked = true;
      });
  }
});

export const { setAuthChecked, clearUserError } = userSlice.actions;
export const userReducer = userSlice.reducer;
