import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetService {
  create(createBudgetDto: CreateBudgetDto) {
    return createBudgetDto;
  }
}
