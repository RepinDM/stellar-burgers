import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';
import {
  createDemoOrderResponse,
  getDemoFeeds,
  getDemoIngredients,
  getDemoOrderByNumber,
  getDemoOrders,
  getDemoUser,
  loginDemoUser,
  logoutDemoUser,
  refreshDemoToken,
  registerDemoUser,
  shouldUseDemoMode,
  updateDemoUser
} from './demo-api';

const URL = process.env.BURGER_API_URL;
const REQUEST_TIMEOUT_MS = 5000;

const isDemoFallbackError = (err: unknown) => {
  if (err instanceof TypeError) return true;
  if (err && typeof err === 'object' && 'name' in err) {
    return String((err as { name?: string }).name) === 'AbortError';
  }
  return false;
};

const request = (input: RequestInfo, init?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(input, {
    ...init,
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));
};

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> => {
  if (shouldUseDemoMode()) return refreshDemoToken();

  return request(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return refreshDemoToken();
      return Promise.reject(err);
    });
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await request(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if (isDemoFallbackError(err)) {
      return Promise.reject(err);
    }

    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await request(url, options);
      return await checkResponse<T>(res);
    }
    return Promise.reject(err);
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () => {
  if (shouldUseDemoMode()) return getDemoIngredients();

  return request(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return getDemoIngredients();
      return Promise.reject(err);
    });
};

export const getFeedsApi = () => {
  if (shouldUseDemoMode()) return getDemoFeeds();

  return request(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return getDemoFeeds();
      return Promise.reject(err);
    });
};

export const getOrdersApi = () => {
  if (shouldUseDemoMode()) return getDemoOrders();

  return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  })
    .then((data) => {
      if (data?.success) return data.orders;
      return Promise.reject(data);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return getDemoOrders();
      return Promise.reject(err);
    });
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) => {
  if (shouldUseDemoMode()) return createDemoOrderResponse(data);

  return fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  })
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return createDemoOrderResponse(data);
      return Promise.reject(err);
    });
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) => {
  if (shouldUseDemoMode()) return getDemoOrderByNumber(number);

  return request(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => checkResponse<TOrderResponse>(res))
    .catch((err) => {
      if (isDemoFallbackError(err)) return getDemoOrderByNumber(number);
      return Promise.reject(err);
    });
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) => {
  if (shouldUseDemoMode()) return registerDemoUser(data);

  return request(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return registerDemoUser(data);
      return Promise.reject(err);
    });
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) => {
  if (shouldUseDemoMode()) return loginDemoUser(data);

  return request(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    })
    .catch((err) => {
      if (isDemoFallbackError(err)) return loginDemoUser(data);
      return Promise.reject(err);
    });
};

export const forgotPasswordApi = (data: { email: string }) =>
  request(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((response) => {
      if (response?.success) return response;
      return Promise.reject(response);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () => {
  if (shouldUseDemoMode()) return getDemoUser();

  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).catch((err) => {
    if (isDemoFallbackError(err)) return getDemoUser();
    return Promise.reject(err);
  });
};

export const updateUserApi = (user: Partial<TRegisterData>) => {
  if (shouldUseDemoMode()) return updateDemoUser(user);

  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  }).catch((err) => {
    if (isDemoFallbackError(err)) return updateDemoUser(user);
    return Promise.reject(err);
  });
};

export const logoutApi = () => {
  if (shouldUseDemoMode()) return logoutDemoUser();

  return request(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .catch((err) => {
      if (isDemoFallbackError(err)) return logoutDemoUser();
      return Promise.reject(err);
    });
};
