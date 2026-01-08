import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movement } from '../movements/entities/movement.entity';

@Injectable()
export class CategoryRulesService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
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
}
