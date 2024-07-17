import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { FindOneOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionType } from '@/transaction/interface/transaction.interface';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private transactionService: TransactionService,
  ) {}

  create(
    createBudgetData: CreateBudgetDto & {
      userId: string;
    },
  ) {
    try {
      if (createBudgetData.receiveAlert) {
        if (!createBudgetData.amountAlert)
          throw new BadRequestException(
            'Amount alert is required when receive alert is true',
          );

        if (createBudgetData.amountAlert > createBudgetData.amount)
          throw new BadRequestException(
            'Amount alert cannot be greater than amount',
          );
      } else {
        createBudgetData.amountAlert = null;
      }

      const budgetItem = this.budgetRepository.create(createBudgetData);

      return this.budgetRepository.save(budgetItem);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException("Can't create budget");
    }
  }

  async updateBudget({
    id,
    userId,
    data,
  }: {
    id: string;
    userId: string;
    data: UpdateBudgetDto;
  }) {
    const budget = await this.budgetRepository.findOneBy({
      id,
    });

    if (!budget) throw new BadRequestException('Budget not found');

    if (budget.userId !== userId)
      throw new BadRequestException('Not authorized');

    if (data.receiveAlert && !data.amountAlert)
      throw new BadRequestException(
        'Amount alert is required when receive alert is true',
      );

    if (!data.receiveAlert) {
      data.amountAlert = null;
    }
    await this.budgetRepository.update(id, {
      ...data,
    });

    return {
      ...budget,
      ...data,
    };
  }

  async deleteBudget({ id, userId }: { id: string; userId: string }) {
    const budget = await this.budgetRepository.findOneBy({
      id,
    });

    if (!budget) throw new BadRequestException('Budget not found');

    if (budget.userId !== userId)
      throw new BadRequestException('Not authorized');

    await this.budgetRepository.delete(id);

    return {
      message: 'Budget deleted successfully',
    };
  }

  async getAllBudgesByCategory({
    userId,
    year,
    category,
  }: {
    userId: string;
    category: string;
    year?: number;
  }) {
    const whereOptions: FindOneOptions<Budget>['where'] = {
      userId: userId,
      categoryId: category,
    };

    if (year) {
      const minDate = new Date(year, 0, 1);
      whereOptions.createdAt = MoreThanOrEqual(minDate);
    }

    const budgetsList = await this.budgetRepository.find({
      where: whereOptions,
      relations: ['user', 'category'],
    });

    const budgetsWithTransactions = await Promise.all(
      budgetsList.map(async (budget) => {
        return {
          ...budget,
          transactions: await this.getBudgetTransactions({
            category,
            year: budget.year,
            month: budget.month,
            userId,
          }),
        };
      }),
    );

    return budgetsWithTransactions;
  }

  getAllBudgesByUser({ userId }: { userId: string }) {
    return this.budgetRepository.find({
      where: {
        userId,
      },
    });
  }

  async getBudgetTransactions({
    category,
    year,
    month,
    userId,
  }: {
    category: string;
    year: number;
    month: number;
    userId: string;
  }) {
    const minDate = new Date(year, month - 1, 1);
    const maxDate = new Date(year, month, 0);
    const result = await this.transactionService.findAll({
      query: {
        categories: [category],
        limit: 1000,
        type: [TransactionType.EXPENSE],
        minDate: minDate.toISOString(),
        maxDate: maxDate.toISOString(),
      },
      userId,
    });

    return result.rows;
  }

  async getAllBudgesByFilters({
    userId,
    year,
  }: {
    userId: string;
    year: number;
  }) {
    const minDate = new Date(year, 0, 1);

    const whereOptions: FindOneOptions<Budget>['where'] = {
      userId: userId,
      createdAt: MoreThanOrEqual(minDate),
    };

    const budgets = await this.budgetRepository.find({
      where: whereOptions,
      relations: ['category'],
    });

    const budgetsDataPromises = budgets.map(async (budget) => {
      const transactions = await this.getBudgetTransactions({
        category: budget.categoryId,
        year: budget.year,
        month: budget.month,
        userId,
      });

      return {
        ...budget,
        transactions,
      };
    });

    const budgetsData = await Promise.all(budgetsDataPromises);

    return budgetsData;
  }
}
