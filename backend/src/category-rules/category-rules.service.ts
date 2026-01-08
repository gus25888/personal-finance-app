import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { Movement } from '../movements/entities/movement.entity';

@Injectable()
export class CategoryRulesService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  private async categoryHasMovements(categoryId: number) {
    const movementQty = await this.movementsRepository.countBy({
      category: { id: categoryId },
    });

    return movementQty > 0;
  }

  async assertCategoryIsErasable(categoryId: number) {
    if (await this.categoryHasMovements(categoryId)) {
      throw new ConflictException(
        `Category '${categoryId}' has movements associated. It cannot be deleted.`,
      );
    }

    return;
  }

  async assertCategoryTypeIsEditable(categoryId: number) {
    if (await this.categoryHasMovements(categoryId)) {
      throw new ConflictException(
        `Category '${categoryId}' has movements associated. It cannot be modified.`,
      );
    }

    return;
  }

  private async getCategoryById(categoryId: number) {
    const category = await this.categoriesRepository.findOneBy({
      id: categoryId,
    });

    return category;
  }

  async getUsableCategory(categoryId: number) {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(`Category '${categoryId}' not found.`);
    }

    if (category.deletedAt) {
      throw new ConflictException(`Category '${categoryId}' has been deleted.`);
    }

    return category;
  }
}
