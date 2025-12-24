import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBExceptions } from '../common/exceptions/handle-db-exception';
import { CategoriesService } from '../categories/categories.service';
import { CreateMovementDto, QueryMovementDto, UpdateMovementDto } from './dto';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  private readonly logger = new Logger(MovementsService.name);

  constructor(
    @InjectRepository(Movement)
    private readonly movementsRepository: Repository<Movement>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createMovementDto: CreateMovementDto) {
    try {
      const { category } = createMovementDto;
      const categoryFound = await this.categoriesService.findOne(category);
      const movement = this.movementsRepository.create({
        ...createMovementDto,
        category: categoryFound,
      });

      await this.movementsRepository.save(movement);

      return {
        ...movement,
        category: {
          id: movement.category.id,
          name: movement.category.name,
          type: movement.category.type,
        },
      };
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(query: QueryMovementDto) {
    this.logger.log({ query });
    const movements = await this.movementsRepository.find({
      relations: { category: true },
    });

    return movements.map((movement) => ({
      ...movement,
      category: {
        id: movement.category.id,
        name: movement.category.name,
        type: movement.category.type,
      },
    }));
  }

  async findOne(id: number) {
    const movement = await this.movementsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movement '${id}' not found`);
    }

    return {
      ...movement,
      category: {
        id: movement.category.id,
        name: movement.category.name,
        type: movement.category.type,
      },
    };
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }
}
