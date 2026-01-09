import { ConflictException } from '@nestjs/common';
import { CategoryRulesService } from './category-rules.service';

describe('CategoryRulesService', () => {
  let service: CategoryRulesService;

  beforeEach(() => {
    service = new CategoryRulesService();
  });

  describe('assertCategoryIsErasable', () => {
    it('should allow deletion when category has no movements', () => {
      expect(() => {
        service.assertCategoryIsErasable(1, 0);
      }).not.toThrow();
    });

    it('should throw ConflictException when category has movements', () => {
      expect(() => {
        service.assertCategoryIsErasable(1, 3);
      }).toThrow(ConflictException);
    });
  });

  describe('assertCategoryTypeIsEditable', () => {
    it('should allow modification when category has no movements', () => {
      expect(() => {
        service.assertCategoryTypeIsEditable(1, 0);
      }).not.toThrow();
    });

    it('should throw ConflictException when category has movements', () => {
      expect(() => {
        service.assertCategoryTypeIsEditable(1, 1);
      }).toThrow(ConflictException);
    });
  });
});
