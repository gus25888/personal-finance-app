import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
}
