import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('This category already exists');
      }
      console.log('error', error);
      throw error;
    }
  }

  async createMany(data: any) {
    try {
      const result = this.categoryRepository.create(data.categories);

      return await this.categoryRepository.save(result);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async getOneByKey(key: string) {
    return this.categoryRepository.findOneBy({ key });
  }
}
