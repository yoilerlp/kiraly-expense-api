import { TransactionType } from '@/transaction/interface/transaction.interface';

export const GET_MIN_AND_MAX_TRANSACTION_DATE = `
    select min(t."createdAt"), max(t."createdAt") 
    from "transaction" t
    where t."userId" = $1
`;

export const GET_USER_BALANCE_BY_MONTH = `
    SELECT SUM(CASE WHEN t.type = '${TransactionType.EXPENSE}' THEN t.amount ELSE 0 END) AS expenses, SUM(CASE WHEN t.type = '${TransactionType.INCOME}' THEN t.amount ELSE 0 END) AS incomes, count(id) AS total
    FROM "transaction" t
    WHERE t."userId" = $1 AND t."createdAt" >= $2 AND t."createdAt" <= $3`;
