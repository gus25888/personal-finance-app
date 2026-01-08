import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
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
  HttpCode,
} from '@nestjs/common';

import { MovementsService } from './movements.service';
import {
  CreateMovementDto,
  QueryMovementDto,
  ResponseMovementDto,
  UpdateMovementDto,
} from './dto';

@Controller('movements')
@ApiExtraModels(CreateMovementDto, UpdateMovementDto)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @ApiBody({ type: CreateMovementDto })
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
    status: HttpStatus.NOT_FOUND,
    description: 'Movement "id" not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List One Movement filtered by id',
    type: ResponseMovementDto,
  })
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMovementDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movement "id" was not found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseMovementDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return this.movementsService.update(+id, updateMovementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deletion performed successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Movement "id" cannot be modified after configured window period.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movement "id" was not found',
  })
  remove(@Param('id') id: string) {
    return this.movementsService.remove(+id);
  }
}
