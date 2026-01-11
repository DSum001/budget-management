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
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateBudgetDto) {
    return this.budgetService.create(req.user.userId, createDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('period') period?: string,
    @Query('isActive') isActive?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.budgetService.findAll(req.user.userId, {
      period,
      isActive: isActive === 'true',
      categoryId,
    });
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.budgetService.findById(req.user.userId, id);
  }

  @Get(':id/status')
  async getStatus(@Request() req, @Param('id') id: string) {
    return this.budgetService.getStatus(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(req.user.userId, id, updateDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.budgetService.delete(req.user.userId, id);
    return { message: 'Budget deleted successfully' };
  }
}
