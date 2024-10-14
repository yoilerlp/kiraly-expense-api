import { Category } from '@/entities';

export const DEFAULT_SYSTEM_CATEGORIES: Category[] = [];

export enum CategoryKey {
  FOOD = 'FOOD',
  BILLS = 'BILLS',
  GASOLINE = 'GASOLINE',
  DIVER = 'DIVER',
  DOMI = 'DOMI',
  LOAN = 'LOAN',
  SALARY = 'SALARY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  CLOTHES = 'CLOTHES',
  HOBBY = 'HOBBY',
  MOTOCYCLE = 'MOTOCYCLE',
  TRANSFER = 'TRANSFER',
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTH = 'HEALTH',
  MONEY_LENT = 'MONEY_LENT',
  OTHER = 'OTHER',
}

interface TransactionCategoryIcon {
  name: string;
  containerColor: string;
  iconColor: string;
}

export const Colors = {
  light_20: '#91919F',
  light_40: '#F2F4F5',
  // light_60: '#F7F9FA',
  light_60: '#F1F1FA',
  light_80: '#FCFCFC',
  light_100: '#FFFFFF',
  white: 'white',

  grayIcon: '#C6C6C6',

  dark_25: '#7A7E80',
  dark_50: '#212325',
  dark_75: '#161719',
  dark_100: '#0D0E0F',

  violet_20: '#EEE5FF',
  violet_40: '#D3BDFF',
  violet_60: '#B18AFF',
  violet_80: '#8F57FF',
  violet_100: '#7F3DFF',

  blue_20: '#BDDCFF',
  blue_40: '#8AC0FF',
  blue_60: '#57A5FF',
  blue_80: '#248AFF',
  blue_100: '#0077FF',

  red_20: '#FDD5D7',
  red_40: '#FDA2A9',
  red_60: '#FD6F7A',
  red_80: '#FD5662',
  red_100: '#FD3C4A',

  green_20: '#CFFAEA',
  green_40: '#93EACA',
  green_60: '#65D1AA',
  green_80: '#2AB784',
  green_100: '#00A86B',

  yellow_20: '#FCEED4',
  yellow_40: '#FCDDA1',
  yellow_60: '#FCCC6F',
  yellow_80: '#FCBB3C',
  yellow_100: '#FCAC12',

  // gradianst
  yellowGradient: {
    start: '#FFF6E5',
    end: 'rgba(255, 246, 229, 0.2)',
  },
} as const;

export const categoriesColorsConfig: Record<
  CategoryKey,
  TransactionCategoryIcon
> = {
  [CategoryKey.FOOD]: {
    name: 'Food',
    containerColor: Colors.red_20,
    iconColor: Colors.red_80,
  },
  [CategoryKey.BILLS]: {
    name: 'Subscription',
    containerColor: Colors.violet_20,
    iconColor: Colors.violet_80,
  },
  [CategoryKey.GASOLINE]: {
    name: 'Transportation',
    containerColor: Colors.red_20,
    iconColor: Colors.red_60,
  },
  [CategoryKey.DIVER]: {
    name: 'Profile',
    containerColor: Colors.green_20,
    iconColor: Colors.green_60,
  },
  [CategoryKey.LOAN]: {
    name: 'Transaction',
    containerColor: Colors.violet_20,
    iconColor: Colors.violet_60,
  },
  [CategoryKey.SALARY]: {
    name: 'Salary',
    containerColor: Colors.green_20,
    iconColor: Colors.green_100,
  },
  [CategoryKey.ENTERTAINMENT]: {
    name: 'Hobby',
    containerColor: Colors.blue_20,
    iconColor: Colors.blue_100,
  },
  [CategoryKey.SUBSCRIPTION]: {
    name: 'Subscription',
    containerColor: Colors.violet_20,
    iconColor: Colors.violet_100,
  },
  [CategoryKey.CLOTHES]: {
    name: 'Shooping',
    containerColor: Colors.red_20,
    iconColor: Colors.red_100,
  },
  [CategoryKey.HOBBY]: {
    name: 'Hobby',
    containerColor: Colors.yellow_20,
    iconColor: Colors.yellow_80,
  },
  [CategoryKey.MOTOCYCLE]: {
    name: 'Transportation',
    containerColor: Colors.blue_20,
    iconColor: Colors.blue_60,
  },
  [CategoryKey.TRANSFER]: {
    name: 'Transfer',
    containerColor: Colors.blue_20,
    iconColor: Colors.blue_80,
  },
  [CategoryKey.TECHNOLOGY]: {
    name: 'Tech',
    containerColor: Colors.yellow_20,
    iconColor: Colors.yellow_100,
  },
  [CategoryKey.HEALTH]: {
    name: 'Health',
    containerColor: Colors.green_20,
    iconColor: Colors.green_80,
  },
  [CategoryKey.MONEY_LENT]: {
    name: 'Transaction',
    containerColor: Colors.green_20,
    iconColor: Colors.green_60,
  },
  [CategoryKey.DOMI]: {
    name: 'Profile',
    containerColor: Colors.blue_20,
    iconColor: Colors.blue_40,
  },
  [CategoryKey.OTHER]: {
    name: 'Other',
    containerColor: Colors.light_40,
    iconColor: Colors.dark_100,
  },
};
