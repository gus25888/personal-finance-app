import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBExceptions } from '../common/exceptions/handle-db-exception';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

import { CategoryRulesService } from '../category-rules/category-rules.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryRulesService: CategoryRulesService,
  ) {}

  async getUsableCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryId}' not found.`);
    }

    if (category.deletedAt) {
      throw new ConflictException(
        `Category '${categoryId}' is already deleted.`,
      );
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);

      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    return await this.getUsableCategory(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (!updateCategoryDto) {
      throw new BadRequestException(`Not valid data sent for the update.`);
    }

    const category = await this.getUsableCategory(id);

    if (
      updateCategoryDto.type !== undefined &&
      category.type !== updateCategoryDto.type
    ) {
      await this.categoryRulesService.assertCategoryTypeIsEditable(id);
    }

    try {
      const categoryToUpdate = {
        ...category,
        updatedAt: new Date(),
        ...updateCategoryDto,
      };
      return await this.categoryRepository.save(categoryToUpdate);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: number) {
    const category = await this.getUsableCategory(id);

    await this.categoryRulesService.assertCategoryIsErasable(category.id);

    try {
      category.deletedAt = new Date();
      await this.categoryRepository.save(category);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
