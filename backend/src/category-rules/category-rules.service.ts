import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRulesService {
  assertCategoryIsErasable(categoryId: number, movementCount: number) {
    if (movementCount > 0) {
      throw new ConflictException(
        `Category '${categoryId}' has movements associated. It cannot be deleted.`,
      );
    }
  }

  assertCategoryTypeIsEditable(categoryId: number, movementCount: number) {
    if (movementCount > 0) {
      throw new ConflictException(
        `Category '${categoryId}' has movements associated. It cannot be modified.`,
      );
    }
  }
}
