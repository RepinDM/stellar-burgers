import { TIngredient, TOrder, TOrdersData, TUser } from './types';

export const DEMO_MODE_KEY = 'stellarBurgersDemoMode';
export const DEMO_USER_KEY = 'stellarBurgersDemoUser';
export const DEMO_ORDERS_KEY = 'stellarBurgersDemoOrders';
export const DEMO_ORDER_COUNTER_KEY = 'stellarBurgersDemoOrderCounter';

export const demoUser: TUser = {
  email: 'demo@stellar-burgers.local',
  name: 'Demo User'
};

export const demoIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png'
  }
];

export const demoOrders: TOrder[] = [
  {
    _id: 'demo-order-1',
    status: 'done',
    name: 'Краторный space бургер',
    createdAt: '2026-09-19T09:10:00.000Z',
    updatedAt: '2026-09-19T09:10:00.000Z',
    number: 90001,
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093c'
    ]
  },
  {
    _id: 'demo-order-2',
    status: 'pending',
    name: 'Флюоресцентный бургер',
    createdAt: '2026-09-19T09:18:00.000Z',
    updatedAt: '2026-09-19T09:18:00.000Z',
    number: 90002,
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093d'
    ]
  },
  {
    _id: 'demo-order-3',
    status: 'done',
    name: 'Биомарсианский бургер',
    createdAt: '2026-09-19T09:25:00.000Z',
    updatedAt: '2026-09-19T09:25:00.000Z',
    number: 90003,
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093c'
    ]
  }
];

export const getStoredDemoUser = (): TUser | null => {
  try {
    const rawUser = localStorage.getItem(DEMO_USER_KEY);
    return rawUser ? (JSON.parse(rawUser) as TUser) : null;
  } catch {
    return null;
  }
};

export const setStoredDemoUser = (user: TUser) => {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
};

export const clearStoredDemoUser = () => {
  localStorage.removeItem(DEMO_USER_KEY);
};

export const enableDemoMode = () => {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
};

export const isDemoMode = () => localStorage.getItem(DEMO_MODE_KEY) === 'true';

export const getStoredDemoOrders = () => {
  try {
    const rawOrders = localStorage.getItem(DEMO_ORDERS_KEY);
    return rawOrders ? (JSON.parse(rawOrders) as TOrder[]) : [];
  } catch {
    return [];
  }
};

export const getDemoOrdersData = (): TOrdersData => {
  const orders = [...getStoredDemoOrders(), ...demoOrders];
  return {
    orders,
    total: Math.max(90003, ...orders.map((order) => order.number)),
    totalToday: orders.length
  };
};

export const findDemoOrder = (number: number) =>
  getDemoOrdersData().orders.find((order) => order.number === number);

export const createDemoOrder = (ingredients: string[]): TOrder => {
  const currentCounter = Number(localStorage.getItem(DEMO_ORDER_COUNTER_KEY));
  const number =
    Number.isFinite(currentCounter) && currentCounter > 90003
      ? currentCounter + 1
      : 90004;
  const createdAt = new Date().toISOString();
  const order: TOrder = {
    _id: `demo-order-${number}`,
    status: 'done',
    name: 'Demo burger',
    createdAt,
    updatedAt: createdAt,
    number,
    ingredients
  };
  const orders = [order, ...getStoredDemoOrders()];
  localStorage.setItem(DEMO_ORDER_COUNTER_KEY, String(number));
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  return order;
};
