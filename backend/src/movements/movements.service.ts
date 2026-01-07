import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBExceptions } from '../common/exceptions/handle-db-exception';
import { CategoriesService } from '../categories/categories.service';
import { CategoryType } from '../categories/constants/categories.constants';

import { CategoryRulesService } from '../category-rules/category-rules.service';

import {
  CreateMovementDto,
  QueryMovementDto,
  UpdateMovementDto,
  ResponseMovementDto,
} from './dto';
import { Movement } from './entities/movement.entity';

type MovementQueryParams = {
  category?: number;
  categoryType?: CategoryType;
  description?: string;
  fromDate?: Date;
  toDate?: Date;
};

@Injectable()
export class MovementsService {
  private readonly logger = new Logger(MovementsService.name);

  constructor(
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
    private readonly categoriesService: CategoriesService,
    private readonly categoryRulesService: CategoryRulesService,
  ) {}

  private buildMovementResponse(movement: Movement): ResponseMovementDto {
    return {
      ...movement,
      category: {
        id: movement.category.id,
        name: movement.category.name,
        type: movement.category.type,
        deletedAt: movement.category.deletedAt,
      },
    };
  }

  async create(createMovementDto: CreateMovementDto) {
    try {
      const { category: categoryId } = createMovementDto;
      const categoryFound =
        await this.categoryRulesService.getUsableCategory(categoryId);
      const movement = this.movementsRepository.create({
        ...createMovementDto,
        category: categoryFound,
      });

      await this.movementsRepository.save(movement);

      return this.buildMovementResponse(movement);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(query: QueryMovementDto) {
    let queryFilter = '1=1';

    const where: MovementQueryParams = {};

    if (query.category) {
      queryFilter += ' and mov.category = :category';
      where.category = query.category;
    }

    if (query.categoryType) {
      queryFilter += ' and category.type = :categoryType';
      where.categoryType = query.categoryType;
    }

    // TODO: Agregar regexp para "description", ya que buscaré por partes del texto. Además, que sea case insensitive.

    // Funciona por búsqueda ded texto exacto pero es case insensitive
    if (query.description) {
      queryFilter += ' and lower(mov.description) = :description';
      where.description = query.description.trim().toLocaleLowerCase();
    }

    if (query.fromDate) {
      queryFilter += ' and mov.date >= :fromDate';
      where.fromDate = query.fromDate;
    }

    if (query.toDate) {
      queryFilter += ' and mov.date <= :toDate';
      where.toDate = query.toDate;
    }

    const movements = await this.movementsRepository
      .createQueryBuilder('mov')
      .withDeleted()
      .leftJoinAndSelect('mov.category', 'category')
      .where(queryFilter, where)
      .getMany();

    return movements.map((movement) => this.buildMovementResponse(movement));
  }

  async findOne(id: number) {
    const movement = await this.movementsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movement '${id}' not found`);
    }

    return this.buildMovementResponse(movement);
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }
}
