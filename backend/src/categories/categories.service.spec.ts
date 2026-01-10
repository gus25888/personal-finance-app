import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movement } from '../movements/entities/movement.entity';
import { CategoryRulesService } from '../category-rules/category-rules.service';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoryType } from './constants/categories.constants';

/**
 * These unit tests focus intentionally on `update` and `remove` methods only.
 *
 * The goal is not to exhaustively test every service method, but to provide
 * a clear and minimal example of unit testing a service that:
 * - orchestrates multiple dependencies
 * - applies conditional domain rules
 * - handles exceptional flows
 * - performs side effects (persistence, soft-delete)
 *
 * Simpler methods (find, create, passthrough helpers) are intentionally excluded,
 * as they do not add meaningful value to this example and are better validated
 * through integration tests.
 *
 * This approach follows a cost–benefit criterion commonly used in small projects
 * and MVPs, while still preserving a solid, reference-quality testing pattern.
 */

/*
  Consider reviewing the eslint.config file in section *.spec.ts, to view the rules to implement related to unit tests.
*/
describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;
  let movementsRepository: Repository<Movement>;
  let categoryRulesService: CategoryRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Movement),
          useValue: {
            countBy: jest.fn(),
          },
        },
        {
          provide: CategoryRulesService,
          useValue: {
            assertCategoryIsErasable: jest.fn(),
            assertCategoryTypeIsEditable: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get(getRepositoryToken(Category));
    movementsRepository = module.get(getRepositoryToken(Movement));
    categoryRulesService = module.get(CategoryRulesService);
  });

  describe('update', () => {
    it('should update category without type change', async () => {
      const category = {
        id: 1,
        name: 'Cat 1',
        type: 'income',
        updatedAt: null,
        deletedAt: null,
      };

      const updateCategoryDto = {
        name: 'New Category',
      };

      jest
        .spyOn(service, 'getUsableCategory')
        .mockResolvedValue(category as any);

      jest.spyOn(service, 'getCategoryMovementsCount').mockResolvedValue(0);

      const assertCategoryTypeIsEditableSpy = jest.spyOn(
        categoryRulesService,
        'assertCategoryTypeIsEditable',
      );

      const saveSpy = jest.spyOn(categoryRepository, 'save').mockResolvedValue({
        ...category,
        ...updateCategoryDto,
      } as any);

      await service.update(1, updateCategoryDto);

      expect(assertCategoryTypeIsEditableSpy).not.toHaveBeenCalled();

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Category',
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should fail if an invalid DTO is sent', async () => {
      const updateCategoryDto = null as any;

      const getUsableCategorySpy = jest.spyOn(service, 'getUsableCategory');
      const getCategoryMovementsCountSpy = jest.spyOn(
        service,
        'getCategoryMovementsCount',
      );
      const assertCategoryTypeIsEditableSpy = jest.spyOn(
        categoryRulesService,
        'assertCategoryTypeIsEditable',
      );
      const saveSpy = jest.spyOn(categoryRepository, 'save');

      await expect(service.update(1, updateCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(getUsableCategorySpy).not.toHaveBeenCalled();
      expect(getCategoryMovementsCountSpy).not.toHaveBeenCalled();
      expect(assertCategoryTypeIsEditableSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should NOT update category if it has movements', async () => {
      const category = {
        id: 1,
        name: 'Cat 1',
        type: 'income',
        updatedAt: null,
        deletedAt: null,
      };

      const updateCategoryDto = {
        type: CategoryType.EXPENSE,
      };

      jest
        .spyOn(service, 'getUsableCategory')
        .mockResolvedValue(category as any);

      jest.spyOn(service, 'getCategoryMovementsCount').mockResolvedValue(100);

      const assertCategoryTypeIsEditableSpy = jest
        .spyOn(categoryRulesService, 'assertCategoryTypeIsEditable')
        .mockImplementation(() => {
          throw new ConflictException();
        });

      const saveSpy = jest.spyOn(categoryRepository, 'save');

      await expect(service.update(1, updateCategoryDto)).rejects.toThrow(
        ConflictException,
      );

      expect(assertCategoryTypeIsEditableSpy).toHaveBeenCalledWith(1, 100);

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft-delete category when it has no movements', async () => {
      const category = { id: 1, deletedAt: null };

      jest
        .spyOn(service, 'getUsableCategory')
        .mockResolvedValue(category as any);
      jest.spyOn(service, 'getCategoryMovementsCount').mockResolvedValue(0);
      jest
        .spyOn(categoryRulesService, 'assertCategoryIsErasable')
        .mockImplementation(() => {});
      const saveSpy = jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(category as any);

      await service.remove(1);

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      );
    });

    it('should NOT soft-delete category when rules throw an error', async () => {
      const category = { id: 1, deletedAt: null };

      jest
        .spyOn(service, 'getUsableCategory')
        .mockResolvedValue(category as any);
      jest.spyOn(service, 'getCategoryMovementsCount').mockResolvedValue(3);
      jest
        .spyOn(categoryRulesService, 'assertCategoryIsErasable')
        .mockImplementation(() => {
          throw new ConflictException();
        });

      const saveSpy = jest.spyOn(categoryRepository, 'save');

      await expect(service.remove(1)).rejects.toThrow(ConflictException);

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
