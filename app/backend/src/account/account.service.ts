import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Account } from './account.schema';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async create(userId: string, createDto: CreateAccountDto): Promise<Account> {
    const account = new this.accountModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      currency: createDto.currency || 'THB',
      includeInTotal: createDto.includeInTotal ?? true,
    });
    return account.save();
  }

  async findAll(userId: string, includeArchived = false): Promise<Account[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (!includeArchived) {
      filter.isArchived = false;
    }
    return this.accountModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(userId: string, accountId: string): Promise<Account> {
    const account = await this.accountModel.findById(accountId).exec();

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this account',
      );
    }

    return account;
  }

  async findByType(userId: string, type: string): Promise<Account[]> {
    return this.accountModel
      .find({
        userId: new Types.ObjectId(userId),
        type,
        isArchived: false,
      })
      .exec();
  }

  async update(
    userId: string,
    accountId: string,
    updateDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findById(userId, accountId);

    Object.assign(account, updateDto);
    return account.save();
  }

  async delete(userId: string, accountId: string): Promise<void> {
    const account = await this.findById(userId, accountId);
    await account.deleteOne();
  }

  async getSummary(userId: string) {
    const accounts = await this.findAll(userId, false);

    const totalBalance = accounts
      .filter((acc) => acc.includeInTotal)
      .reduce((sum, acc) => sum + acc.balance, 0);

    const byType = accounts.reduce(
      (acc, account) => {
        if (!acc[account.type]) {
          acc[account.type] = 0;
        }
        acc[account.type] += account.balance;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalBalance,
      byType,
      accounts: accounts.map((acc) => ({
        id: acc._id,
        name: acc.name,
        type: acc.type,
        balance: acc.balance,
        currency: acc.currency,
        color: acc.color,
        icon: acc.icon,
      })),
    };
  }

  async updateBalance(
    userId: string,
    accountId: string,
    amount: number,
  ): Promise<Account> {
    const account = await this.findById(userId, accountId);
    account.balance += amount;
    return account.save();
  }
}
