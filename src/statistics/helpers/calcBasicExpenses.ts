import { Category, Transaction } from '@/entities';
import { TransactionType } from '@/transaction/interface/transaction.interface';

export const calcBasicExpenses = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpense = 0;

  let totalIncomeByCategory: Record<
    string,
    {
      value: number;
      detail: Category;
    }
  > = {};

  let totalExpenseByCategory: typeof totalIncomeByCategory = {};

  transactions?.forEach((transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      totalIncome += transaction.amount;

      const oldCategoryImcomeValue =
        totalIncomeByCategory[transaction.categoryId]?.value || 0;

      totalIncomeByCategory[transaction.categoryId] = {
        value: oldCategoryImcomeValue + transaction.amount,
        detail: transaction.category,
      };
    }

    if (transaction.type === TransactionType.EXPENSE) {
      totalExpense += transaction.amount;

      const oldCategoryExpenseValue =
        totalExpenseByCategory[transaction.categoryId]?.value || 0;

      totalExpenseByCategory[transaction.categoryId] = {
        value: oldCategoryExpenseValue + transaction.amount,
        detail: transaction.category,
      };
    }
  });

  const balance = totalIncome - totalExpense;

  const categoryWithMaxIcomeValue = Object.values(totalIncomeByCategory).reduce(
    (category, current) => {
      if (current.value > category.value) {
        return current;
      } else {
        return category;
      }
    },
    {
      value: 0,
      detail: null,
    },
  );

  const categoryWithMaxExpenseValue = Object.values(
    totalExpenseByCategory,
  ).reduce(
    (category, current) => {
      if (current.value > category.value) {
        return current;
      } else {
        return category;
      }
    },
    {
      value: 0,
      detail: null,
    },
  );

  return {
    totalExpense,
    totalIncome,
    balance,
    categoryWithMaxIcomeValue,
    categoryWithMaxExpenseValue,
    transactions,
  };
};
