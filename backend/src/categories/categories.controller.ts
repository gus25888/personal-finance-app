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
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // TODO: Change HTTP STATUS code from numbers to HttpStatus values
  @Get()
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 200,
    description: 'List of Categories',
    type: [Category],
  })
  getAll() {
    return this.categoriesService.findAll();
  }
  @Get(':id')
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 200,
    description: 'A Category found by id',
    type: Category,
  })
  getOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Category was created',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
      'Category has associated movements: it cannot be modified. Also, could be that Category name must be unique among active categories.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '',
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
    type: Category,
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
