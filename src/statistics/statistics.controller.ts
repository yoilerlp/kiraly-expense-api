import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ReportsParamsDto } from './dto/reports-params.dto';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('basic-report')
  findAll(@Query() query: ReportsParamsDto, @GetUser() user: IUserToken) {
    return this.statisticsService.getBasicReport({
      ...query,
      userId: user.userId,
    });
  }
}
