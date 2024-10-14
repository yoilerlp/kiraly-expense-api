import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: IUserToken,
  ) {
    return this.categoryService.create({
      createCategoryDto,
      userId: user.userId,
    });
  }
  // @Post('bull-create')
  // createBull(@Body() body: any) {
  //   return this.categoryService.createMany(body);
  // }
  // @Get('update-colors')
  // UpdateCagoryColorsByCategoryKey() {
  //   return this.categoryService.updateCategoryColorByKey();
  // }

  @Get(':id')
  GetOne(@GetUser() user: IUserToken, @Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getOneById({
      id,
      userId: user.userId,
    });
  }
  @Get()
  findAll(@GetUser() user: IUserToken) {
    return this.categoryService.findAll({
      userId: user.userId,
    });
  }

  @Patch(':id')
  update(
    @GetUser() user: IUserToken,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.categoryService.update({
      id,
      userId: user.userId,
      data: updateCategoryDto,
    });
  }

  
}
