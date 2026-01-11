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
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateAccountDto) {
    return this.accountService.create(req.user.userId, createDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('includeArchived') includeArchived?: string,
    @Query('type') type?: string,
  ) {
    if (type) {
      return this.accountService.findByType(req.user.userId, type);
    }
    return this.accountService.findAll(
      req.user.userId,
      includeArchived === 'true',
    );
  }

  @Get('summary')
  async getSummary(@Request() req) {
    return this.accountService.getSummary(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.accountService.findById(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateAccountDto,
  ) {
    return this.accountService.update(req.user.userId, id, updateDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.accountService.delete(req.user.userId, id);
    return { message: 'ลบบัญชีเรียบร้อยแล้ว' };
  }
}
