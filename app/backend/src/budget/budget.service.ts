import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from './budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  async create(userId: string, createDto: CreateBudgetDto): Promise<Budget> {
    const budget = new this.budgetModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      categoryId: createDto.categoryId
        ? new Types.ObjectId(createDto.categoryId)
        : null,
      startDate: new Date(createDto.startDate),
      endDate: createDto.endDate ? new Date(createDto.endDate) : null,
      spent: 0,
      alertEnabled: createDto.alertEnabled ?? true,
      alertThreshold: createDto.alertThreshold ?? 80,
      rollover: createDto.rollover ?? false,
      isActive: true,
    });

    return budget.save();
  }

  async findAll(
    userId: string,
    filters: {
      period?: string;
      isActive?: boolean;
      categoryId?: string;
    } = {},
  ): Promise<Budget[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters.period) {
      query.period = filters.period;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    return this.budgetModel
      .find(query)
      .populate('categoryId', 'name icon color')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(userId: string, budgetId: string): Promise<Budget> {
    const budget = await this.budgetModel
      .findById(budgetId)
      .populate('categoryId', 'name icon color type')
      .exec();

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this budget',
      );
    }

    return budget;
  }

  async update(
    userId: string,
    budgetId: string,
    updateDto: UpdateBudgetDto,
  ): Promise<Budget> {
    const budget = await this.findById(userId, budgetId);

    if (updateDto.startDate) {
      budget.startDate = new Date(updateDto.startDate);
    }

    if (updateDto.endDate) {
      budget.endDate = new Date(updateDto.endDate);
    }

    if (updateDto.categoryId) {
      budget.categoryId = new Types.ObjectId(updateDto.categoryId);
    }

    Object.assign(budget, {
      ...updateDto,
      startDate: budget.startDate,
      endDate: budget.endDate,
      categoryId: budget.categoryId,
    });

    return budget.save();
  }

  async delete(userId: string, budgetId: string): Promise<void> {
    const budget = await this.findById(userId, budgetId);
    await budget.deleteOne();
  }

  async getStatus(userId: string, budgetId: string): Promise<any> {
    const budget = await this.findById(userId, budgetId);

    const percentage = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    const isOverBudget = budget.spent > budget.amount;
    const shouldAlert =
      budget.alertEnabled && percentage >= budget.alertThreshold;

    // คำนวณวันที่เหลือ
    const now = new Date();
    const endDate = budget.endDate || this.calculatePeriodEndDate(budget);
    const daysLeft = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      budgetId: budget._id,
      name: budget.name,
      amount: budget.amount,
      spent: budget.spent,
      remaining,
      percentage: Math.round(percentage * 100) / 100,
      isOverBudget,
      shouldAlert,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      period: budget.period,
      startDate: budget.startDate,
      endDate,
    };
  }

  async updateSpent(
    userId: string,
    budgetId: string,
    amount: number,
  ): Promise<Budget> {
    const budget = await this.findById(userId, budgetId);
    budget.spent += amount;
    return budget.save();
  }

  private calculatePeriodEndDate(budget: Budget): Date {
    const start = budget.startDate;
    const end = new Date(start);

    switch (budget.period) {
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }

    return end;
  }

  async getActiveBudgetsForCategory(
    userId: string,
    categoryId: string,
  ): Promise<Budget[]> {
    return this.budgetModel
      .find({
        userId: new Types.ObjectId(userId),
        categoryId: new Types.ObjectId(categoryId),
        isActive: true,
      })
      .exec();
  }
}
