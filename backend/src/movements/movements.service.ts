import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoriesService } from '../categories/categories.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
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
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
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

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    if (error instanceof HttpException) {
      throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs!',
    );
  }
}
