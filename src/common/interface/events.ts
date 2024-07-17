import { TransactionType } from '@/transaction/interface/transaction.interface';

export type TransactionCreatedPayload = {
  userId: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
};
