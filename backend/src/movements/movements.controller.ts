import { ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';

import { MovementsService } from './movements.service';
import {
  CreateMovementDto,
  UpdateMovementDto,
  QueryMovementDto,
  ResponseMovementDto,
} from './dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new Movement',
    type: ResponseMovementDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  create(@Body() createMovementDto: CreateMovementDto) {
    return this.movementsService.create(createMovementDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List All Movements',
    type: [ResponseMovementDto],
  })
  findAll(@Query() query: QueryMovementDto) {
    return this.movementsService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List One Movement filtered by id',
    type: ResponseMovementDto,
  })
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementsService.update(+id, updateMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementsService.remove(+id);
  }
}
