import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ResponseCategoryDto } from './dtos/response-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of Categories',
    type: [ResponseCategoryDto],
  })
  getAll() {
    return this.categoriesService.findAll();
  }
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A Category found by id',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category is already deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category was not found.',
  })
  getOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category was created',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category name must be unique among active categories.',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Category has associated movements: it cannot be modified. Also, could be that Category name must be unique among active categories. Or the Category is already deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category was not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Not valid data sent for the update.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: ResponseCategoryDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deletion performed successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category is already deleted or has associated movements',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category was not found',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
