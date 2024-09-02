import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TransactionModule } from '@/transaction/transaction.module';
import { BudgetModule } from '@/budget/budget.module';

@Module({
  imports: [TransactionModule, BudgetModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
