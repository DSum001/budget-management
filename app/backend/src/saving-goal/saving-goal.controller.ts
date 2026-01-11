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
import { SavingGoalService } from './saving-goal.service';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saving-goals')
@UseGuards(JwtAuthGuard)
export class SavingGoalController {
  constructor(private readonly savingGoalService: SavingGoalService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateSavingGoalDto) {
    return this.savingGoalService.create(req.user.userId, createDto);
  }

  @Get()
  async findAll(@Request() req, @Query('status') status?: string) {
    return this.savingGoalService.findAll(req.user.userId, status);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.savingGoalService.findById(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateSavingGoalDto,
  ) {
    return this.savingGoalService.update(req.user.userId, id, updateDto);
  }

  @Patch(':id/progress')
  async updateProgress(
    @Request() req,
    @Param('id') id: string,
    @Body() progressDto: UpdateProgressDto,
  ) {
    return this.savingGoalService.updateProgress(
      req.user.userId,
      id,
      progressDto,
    );
  }

  @Post(':id/complete')
  async complete(@Request() req, @Param('id') id: string) {
    return this.savingGoalService.complete(req.user.userId, id);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.savingGoalService.delete(req.user.userId, id);
    return { message: 'Goal deleted successfully' };
  }
}
