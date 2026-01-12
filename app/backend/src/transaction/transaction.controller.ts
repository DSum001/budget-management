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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto, TransferDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Request() req: any, @Body() createDto: CreateTransactionDto) {
    // @ts-ignore
    return this.transactionService.create(req.user.userId, createDto);
  }

  @Post('transfer')
  async transfer(@Request() req: any, @Body() transferDto: TransferDto) {
    // @ts-ignore
    return this.transactionService.transfer(req.user.userId, transferDto);
  }

  @Post('bulk-delete')
  async bulkDelete(@Request() req, @Body('ids') ids: string[]) {
    await this.transactionService.bulkDelete(req.user.userId, ids);
    return { message: 'Transactions deleted successfully' };
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // @ts-ignore
    return this.transactionService.findAll(req.user.userId, {
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      tags,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    // @ts-ignore
    return this.transactionService.findById(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
  ) {
    // @ts-ignore
    return this.transactionService.update(req.user.userId, id, updateDto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    // @ts-ignore
    await this.transactionService.delete(req.user.userId, id);
    return { message: 'Transaction deleted successfully' };
  }
}
