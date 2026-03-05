import { ConfigService } from '@nestjs/config';
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

import { CategoryType } from '../categories/constants/categories.constants';
import { CategoriesService } from '../categories/categories.service';

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
    private readonly configService: ConfigService,
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

  private async getMovementById(id: number) {
    const movement = await this.movementsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movement '${id}' not found`);
    }
    return movement;
  }

  private assertValidMovementDate(movementDate: Date, now = Date.now()) {
    if (movementDate.valueOf() > now) {
      throw new BadRequestException(
        `Movement date cannot be after the current day: ${new Date(now).toISOString()}.`,
      );
    }
  }

  private assertMovementIsMutable(
    movementDate: Date,
    maxMutableDays: number,
    now = Date.now(),
  ) {
    const maxMutableDaysInMs = maxMutableDays * 24 * 60 * 60 * 1000;
    const movementDaysPassedInMs = now - movementDate.valueOf();

    if (movementDaysPassedInMs > maxMutableDaysInMs) {
      throw new ConflictException(
        `Movement cannot be modified after ${maxMutableDays} days of its occurrence.`,
      );
    }
  }

  async create(createMovementDto: CreateMovementDto) {
    try {
      const { category: categoryId, date } = createMovementDto;

      this.assertValidMovementDate(date);

      const categoryFound =
        await this.categoriesService.getUsableCategory(categoryId);
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
      const startDate = new Date(query.fromDate);
      startDate.setUTCHours(0, 0, 0, 0);
      queryFilter += ' and mov.date >= :fromDate';
      where.fromDate = startDate;
    }

    if (query.toDate) {
      const endDate = new Date(query.toDate);
      endDate.setUTCHours(23, 59, 59, 999);
      queryFilter += ' and mov.date <= :toDate';
      where.toDate = endDate;
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
    return this.buildMovementResponse(await this.getMovementById(id));
  }

  async update(id: number, updateMovementDto: UpdateMovementDto) {
    const movement = await this.getMovementById(id);
    const maxMutableDays = this.configService.getOrThrow<number>(
      'MOVEMENT_EDIT_WINDOW_DAYS',
    );
    this.assertMovementIsMutable(movement.date, maxMutableDays);

    if (updateMovementDto.date) {
      this.assertValidMovementDate(updateMovementDto.date);
    }

    try {
      const movementToUpdate = {
        ...movement,
        ...updateMovementDto,
        category: updateMovementDto.category
          ? await this.categoriesService.getUsableCategory(
              updateMovementDto.category,
            )
          : movement.category,
        updatedAt: new Date(),
      };

      const movementUpdated =
        await this.movementsRepository.save(movementToUpdate);

      return this.buildMovementResponse(movementUpdated);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: number) {
    const movement = await this.getMovementById(id);
    const maxMutableDays = this.configService.getOrThrow<number>(
      'MOVEMENT_EDIT_WINDOW_DAYS',
    );
    this.assertMovementIsMutable(movement.date, maxMutableDays);

    try {
      await this.movementsRepository.remove(movement);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
    return;
  }
}
