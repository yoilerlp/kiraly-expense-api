import { TransactionService } from '@/transaction/transaction.service';
import { Injectable } from '@nestjs/common';
import { ReportsParamsDto } from './dto/reports-params.dto';
import { TransactionType } from '@/transaction/interface/transaction.interface';
import { Category } from '@/entities';
import { calcBasicExpenses } from './helpers/calcBasicExpenses';
import { BudgetService } from '@/budget/budget.service';
import { Between } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
  ) {}

  async getBasicReport(
    params: ReportsParamsDto & {
      userId: string;
    },
  ) {
    const { maxDate, minDate, userId } = params;

    const transactions = await this.transactionService.findAll({
      query: {
        minDate,
        maxDate,
        limit: 10000,
      },
      userId,
    });

    const minDataObject = new Date(minDate);

    const maxDataObject = new Date(maxDate);

    const budgets = await this.budgetService.getAllBudgesByUser({
      userId,
      filterOptions: {
        year: Between(minDataObject.getFullYear(), maxDataObject.getFullYear()),
        month: Between(
          minDataObject.getMonth() + 1,
          maxDataObject.getMonth() + 1,
        ),
      },
    });

    const budgetsExceeds = budgets?.filter((b) => b.alertNotified);

    const basicExpenses = calcBasicExpenses(transactions.rows);

    return {
      basicExpenses,
      budgetsExceeds,
      budgets,
    };
  }
}
