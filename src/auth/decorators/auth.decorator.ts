import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'routeIsPublicKey_expense-tracker-api';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
