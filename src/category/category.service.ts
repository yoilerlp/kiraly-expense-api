import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryType } from './interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { categoriesColorsConfig } from './utils/data';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create({
    createCategoryDto,
    userId,
  }: {
    createCategoryDto: CreateCategoryDto;
    userId: string;
  }) {
    try {
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        userId,
        type: CategoryType.USER,
      });
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('This category already exists');
      }
      console.log('error', error);
      throw error;
    }
  }

  async update({
    id,
    data,
    userId,
  }: {
    id: string;
    data: UpdateCategoryDto;
    userId: string;
  }) {
    try {
      const categoryToUpdate = await this.categoryRepository.findOneBy({
        id,
      });

      if (!categoryToUpdate) {
        throw new BadRequestException('Category not found');
      }

      if (
        categoryToUpdate.userId !== userId ||
        categoryToUpdate.type === CategoryType.SYSTEM
      ) {
        throw new UnauthorizedException('Not authorized');
      }

      await this.categoryRepository.update(
        { id },
        {
          ...categoryToUpdate,
          ...data,
        },
      );

      return {
        ...categoryToUpdate,
        ...data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
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

  findAll({
    userId,
    showInactive,
  }: {
    userId: string;
    showInactive?: boolean;
  }) {
    return this.categoryRepository.find({
      where: [
        {
          userId,
          isActive: showInactive ? true : undefined,
        },
        {
          type: CategoryType.SYSTEM,
        },
      ],
    });
  }

  async getOneById({ id, userId }: { id: string; userId: string }) {
    const category = await this.categoryRepository.findOneBy({ id, userId });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }
  async getOneByKey(key: string) {
    return this.categoryRepository.findOneBy({ key });
  }

  async updateCategoryColorByKey() {
    const allCategories = await this.categoryRepository.find();

    for (const category of allCategories) {
      const categoryConfig = categoriesColorsConfig[category.key];
      if (!categoryConfig) continue;

      if (category.icon || category.mainColor || category.subColor) continue;

      await this.categoryRepository.update(category.id, {
        icon: categoryConfig.name,
        mainColor: categoryConfig.iconColor,
        subColor: categoryConfig.containerColor,
      });
    }
  }
}
