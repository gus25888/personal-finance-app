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
import { Movement } from '../movements/entities/movement.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
    private readonly categoryRulesService: CategoryRulesService,
  ) {}

  async getCategoryMovementsCount(categoryId: number) {
    return await this.movementsRepository.countBy({
      category: { id: categoryId },
    });
  }

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
    const movementCount = await this.getCategoryMovementsCount(id);

    if (
      updateCategoryDto.type !== undefined &&
      category.type !== updateCategoryDto.type
    ) {
      this.categoryRulesService.assertCategoryTypeIsEditable(id, movementCount);
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
    const movementCount = await this.getCategoryMovementsCount(id);

    this.categoryRulesService.assertCategoryIsErasable(
      category.id,
      movementCount,
    );

    try {
      category.deletedAt = new Date();
      await this.categoryRepository.save(category);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
