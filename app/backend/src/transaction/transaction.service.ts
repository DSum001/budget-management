import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './transaction-v2.schema';
import { CreateTransactionDto } from './dto/create-transaction-v2.dto';
import { UpdateTransactionDto } from './dto/update-transaction-v2.dto';
import { TransferDto } from './dto/transfer.dto';
import { AccountService } from '../account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    private accountService: AccountService,
  ) {}

  async create(
    userId: string,
    createDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // ตรวจสอบว่า account และ category เป็นของ user นี้
    await this.accountService.findById(userId, createDto.accountId);

    const transaction = new this.transactionModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(createDto.categoryId),
      accountId: new Types.ObjectId(createDto.accountId),
      date: new Date(createDto.date),
      isRecurring: createDto.isRecurring ?? false,
      tags: createDto.tags || [],
      attachments: createDto.attachments || [],
    });

    const saved = await transaction.save();

    // อัพเดทยอดเงินในบัญชี
    // @ts-ignore
    const amount =
      createDto.type === 'income' ? createDto.amount : -createDto.amount;
    await this.accountService.updateBalance(
      userId,
      createDto.accountId,
      amount,
    );

    return saved;
  }

  async findAll(
    userId: string,
    filters: {
      type?: string;
      categoryId?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
      tags?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    // @ts-ignore
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    if (filters.accountId) {
      query.accountId = new Types.ObjectId(filters.accountId);
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    if (filters.tags) {
      const tagList = filters.tags.split(',');
      query.tags = { $in: tagList };
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { note: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .populate('categoryId', 'name icon color')
        .populate('accountId', 'name type')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(userId: string, transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(transactionId)
      .populate('categoryId', 'name icon color type')
      .populate('accountId', 'name type')
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this transaction',
      );
    }

    return transaction;
  }

  async update(
    userId: string,
    transactionId: string,
    updateDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findById(userId, transactionId);

    // @ts-ignore
    const oldAmount =
      transaction.type === 'income' ? transaction.amount : -transaction.amount;

    Object.assign(transaction, updateDto);

    if (updateDto.date) {
      transaction.date = new Date(updateDto.date);
    }

    const saved = await transaction.save();

    // ถ้ามีการเปลี่ยน amount หรือ type ต้องอัพเดทยอดเงิน
    if (updateDto.amount !== undefined || updateDto.type !== undefined) {
      // คืนเงินเก่า
      await this.accountService.updateBalance(
        userId,
        transaction.accountId.toString(),
        -oldAmount,
      );

      // หักเงินใหม่
      // @ts-ignore
      const newAmount = saved.type === 'income' ? saved.amount : -saved.amount;
      await this.accountService.updateBalance(
        userId,
        transaction.accountId.toString(),
        newAmount,
      );
    }

    return saved;
  }

  async delete(userId: string, transactionId: string): Promise<void> {
    const transaction = await this.findById(userId, transactionId);

    // คืนเงินให้บัญชี
    // @ts-ignore
    const amount =
      transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await this.accountService.updateBalance(
      userId,
      transaction.accountId.toString(),
      amount,
    );

    await transaction.deleteOne();
  }

  async bulkDelete(userId: string, ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(userId, id);
    }
  }

  async transfer(userId: string, transferDto: TransferDto): Promise<any> {
    const { amount, fromAccountId, toAccountId, date } = transferDto;

    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer within the same account');
    }

    // Check accounts
    const fromAccount = await this.accountService.findById(
      userId,
      fromAccountId,
    );
    const toAccount = await this.accountService.findById(userId, toAccountId);

    if (fromAccount.balance < amount) {
      throw new BadRequestException('Insufficient balance in account');
    }

    // Deduct from source account
    await this.accountService.updateBalance(userId, fromAccountId, -amount);

    // Add to destination account
    await this.accountService.updateBalance(userId, toAccountId, amount);

    return {
      message: 'Transfer completed successfully',
      from: {
        accountId: fromAccountId,
        accountName: fromAccount.name,
        newBalance: fromAccount.balance - amount,
      },
      to: {
        accountId: toAccountId,
        accountName: toAccount.name,
        newBalance: toAccount.balance + amount,
      },
      amount,
      date,
    };
  }
}
