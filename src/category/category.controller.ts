import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('bull-create')
  createBull(@Body() body: any) {
    return this.categoryService.createMany(body);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
