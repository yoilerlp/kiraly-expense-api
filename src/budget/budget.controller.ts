import {
  Controller,
  Post,
  Body,
  HttpCode,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';
import { FilterBudgetsDto } from './dto/filter-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @GetUser() user: IUserToken,
  ) {
    return this.budgetService.create({
      ...createBudgetDto,
      userId: user.userId,
    });
  }

  @Patch(':id')
  updateBudget(
    @Body() updateBudgetDto: UpdateBudgetDto,
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.budgetService.updateBudget({
      id,
      userId: user.userId,
      data: updateBudgetDto,
    });
  }

  @Post('filter')
  @HttpCode(200)
  getAllBudgesByFilters(
    @Body() body: FilterBudgetsDto,
    @GetUser() user: IUserToken,
  ) {
    return this.budgetService.getAllBudgesByFilters({
      userId: user.userId,
      year: body.year,
    });
  }
}
