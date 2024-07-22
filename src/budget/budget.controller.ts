import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  Query,
  Get,
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

  @Delete(':id')
  deleteBudget(
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.budgetService.deleteBudget({
      id,
      userId: user.userId,
    });
  }

  @Get('filter')
  getAllBudgesByFilters(
    @GetUser() user: IUserToken,
    @Query() query: FilterBudgetsDto,
  ) {
    const { year, month } = query;

    return this.budgetService.getAllBudgesByFilters({
      userId: user.userId,
      year: year || new Date().getFullYear(),
      month: month || new Date().getMonth() + 1,
    });
  }
  @Get('history')
  getAllBudgesHistory(@GetUser() user: IUserToken) {
    return this.budgetService.getAllBudgesByUser({
      userId: user.userId,
    });
  }

  @Get(':id')
  getBudgetById(
    @GetUser() user: IUserToken,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.budgetService.getBudgetById({
      userId: user.userId,
      budgetId: id,
    });
  }
}
