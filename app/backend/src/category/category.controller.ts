import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateCategoryDto) {
    return this.categoryService.create(req.user.userId, createDto);
  }

  @Post('initialize')
  async initialize(@Request() req) {
    await this.categoryService.initializeDefaultCategories(req.user.userId);
    return { message: 'สร้างหมวดหมู่เริ่มต้นเรียบร้อยแล้ว' };
  }

  @Get()
  async findAll(@Request() req, @Query('type') type?: string) {
    return this.categoryService.findAll(req.user.userId, type);
  }

  @Get('tree')
  async findTree(@Request() req) {
    return this.categoryService.findWithSubCategories(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.categoryService.findById(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(req.user.userId, id, updateDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.categoryService.delete(req.user.userId, id);
    return { message: 'ลบหมวดหมู่เรียบร้อยแล้ว' };
  }
}
