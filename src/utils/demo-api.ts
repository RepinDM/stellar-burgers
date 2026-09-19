import { setCookie } from './cookie';
import {
  clearStoredDemoUser,
  createDemoOrder,
  demoIngredients,
  demoUser,
  enableDemoMode,
  findDemoOrder,
  getDemoOrdersData,
  getStoredDemoUser,
  isDemoMode,
  setStoredDemoUser
} from './demo-data';
import { TIngredient, TOrdersData, TUser } from './types';
import type { TLoginData, TRegisterData } from './burger-api';

type TServerResponse<T> = {
  success: boolean;
} & T;

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

const demoAccessToken = 'Bearer demo-access-token';
const demoRefreshToken = 'demo-refresh-token';

const markDemoAuth = (user: TUser): TAuthResponse => {
  enableDemoMode();
  setStoredDemoUser(user);
  setCookie('accessToken', demoAccessToken);
  localStorage.setItem('refreshToken', demoRefreshToken);
  return {
    success: true,
    accessToken: demoAccessToken,
    refreshToken: demoRefreshToken,
    user
  };
};

export const getDemoIngredients = async (): Promise<TIngredient[]> => {
  enableDemoMode();
  try {
    const res = await fetch('/data/ingredients.json');
    if (res.ok) {
      const data = (await res.json()) as TServerResponse<{
        data: TIngredient[];
      }>;
      if (data.success && Array.isArray(data.data)) return data.data;
    }
  } catch {}
  return demoIngredients;
};

export const getDemoFeeds = async (): Promise<TServerResponse<TOrdersData>> => {
  enableDemoMode();
  try {
    const res = await fetch('/data/orders.json');
    if (res.ok) {
      const data = (await res.json()) as TServerResponse<TOrdersData>;
      if (data.success && Array.isArray(data.orders)) {
        const stored = getDemoOrdersData().orders.filter((order) =>
          order._id.startsWith('demo-order-9')
        );
        return {
          success: true,
          orders: [...stored, ...data.orders],
          total: Math.max(data.total, ...stored.map((order) => order.number)),
          totalToday: data.totalToday + stored.length
        };
      }
    }
  } catch {}
  return { success: true, ...getDemoOrdersData() };
};

export const getDemoOrders = async () => {
  enableDemoMode();
  return getDemoOrdersData().orders;
};

export const getDemoOrderByNumber = async (number: number) => {
  enableDemoMode();
  const order = findDemoOrder(number);
  return {
    success: true,
    orders: order ? [order] : []
  };
};

export const createDemoOrderResponse = async (ingredients: string[]) => {
  enableDemoMode();
  const order = createDemoOrder(ingredients);
  return {
    success: true,
    name: order.name,
    order
  };
};

export const registerDemoUser = async (data: TRegisterData) =>
  markDemoAuth({
    email: data.email || demoUser.email,
    name: data.name || demoUser.name
  });

export const loginDemoUser = async (data: TLoginData) =>
  markDemoAuth({
    email: data.email || demoUser.email,
    name: getStoredDemoUser()?.name || demoUser.name
  });

export const refreshDemoToken = async () => {
  enableDemoMode();
  setCookie('accessToken', demoAccessToken);
  localStorage.setItem('refreshToken', demoRefreshToken);
  return {
    success: true,
    accessToken: demoAccessToken,
    refreshToken: demoRefreshToken
  };
};

export const getDemoUser = async () => {
  enableDemoMode();
  return {
    success: true,
    user: getStoredDemoUser() || demoUser
  };
};

export const updateDemoUser = async (user: Partial<TRegisterData>) => {
  enableDemoMode();
  const nextUser = {
    email: user.email || getStoredDemoUser()?.email || demoUser.email,
    name: user.name || getStoredDemoUser()?.name || demoUser.name
  };
  setStoredDemoUser(nextUser);
  return {
    success: true,
    user: nextUser
  };
};

export const logoutDemoUser = async () => {
  enableDemoMode();
  clearStoredDemoUser();
  localStorage.removeItem('refreshToken');
  return { success: true };
};

export const shouldUseDemoMode = () => isDemoMode();
