import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { TransactionModule } from '@/transaction/transaction.module';
import { BudgetEventsService } from './budget-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), TransactionModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetEventsService],
  exports: [BudgetService],
})
export class BudgetModule {}
