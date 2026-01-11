import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SavingGoal, GoalStatus } from './saving-goal.schema';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class SavingGoalService {
  constructor(
    @InjectModel(SavingGoal.name) private savingGoalModel: Model<SavingGoal>,
  ) {}

  async create(
    userId: string,
    createDto: CreateSavingGoalDto,
  ): Promise<SavingGoal> {
    const goal = new this.savingGoalModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      linkedAccountId: createDto.linkedAccountId
        ? new Types.ObjectId(createDto.linkedAccountId)
        : null,
      targetDate: new Date(createDto.targetDate),
      currentAmount: createDto.currentAmount || 0,
      status: 'active',
    });

    return goal.save();
  }

  async findAll(userId: string, status?: string): Promise<SavingGoal[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (status) {
      query.status = status;
    }

    const goals = await this.savingGoalModel
      .find(query)
      .populate('linkedAccountId', 'name type')
      .sort({ createdAt: -1 })
      .exec();

    return goals.map((goal) => this.calculateProgress(goal));
  }

  async findById(userId: string, goalId: string): Promise<SavingGoal> {
    const goal = await this.savingGoalModel
      .findById(goalId)
      .populate('linkedAccountId', 'name type')
      .exec();

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this goal',
      );
    }

    return this.calculateProgress(goal);
  }

  async update(
    userId: string,
    goalId: string,
    updateDto: UpdateSavingGoalDto,
  ): Promise<SavingGoal> {
    const goal = await this.findById(userId, goalId);

    if (updateDto.targetDate) {
      goal.targetDate = new Date(updateDto.targetDate);
    }

    if (updateDto.linkedAccountId) {
      goal.linkedAccountId = new Types.ObjectId(updateDto.linkedAccountId);
    }

    Object.assign(goal, {
      ...updateDto,
      targetDate: goal.targetDate,
      linkedAccountId: goal.linkedAccountId,
    });

    return goal.save();
  }

  async delete(userId: string, goalId: string): Promise<void> {
    const goal = await this.findById(userId, goalId);
    await goal.deleteOne();
  }

  async updateProgress(
    userId: string,
    goalId: string,
    progressDto: UpdateProgressDto,
  ): Promise<SavingGoal> {
    const goal = await this.findById(userId, goalId);

    if (goal.status === GoalStatus.COMPLETED) {
      throw new BadRequestException('This goal has already been achieved');
    }

    if (goal.status === GoalStatus.CANCELLED) {
      throw new BadRequestException('This goal has been cancelled');
    }

    goal.currentAmount += progressDto.amount;

    // ตรวจสอบว่าบรรลุเป้าหมายหรือยัง
    if (goal.currentAmount >= goal.targetAmount) {
      goal.currentAmount = goal.targetAmount;
      goal.status = GoalStatus.COMPLETED;
    }

    return goal.save();
  }

  async complete(userId: string, goalId: string): Promise<SavingGoal> {
    const goal = await this.findById(userId, goalId);

    if (goal.status === GoalStatus.COMPLETED) {
      throw new BadRequestException('เป้าหมายนี้บรรลุแล้ว');
    }

    goal.status = GoalStatus.COMPLETED;
    goal.currentAmount = goal.targetAmount;

    return goal.save();
  }

  private calculateProgress(goal: SavingGoal): any {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;

    // คำนวณวันที่เหลือ
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysLeft = Math.ceil(
      (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    // คำนวณจำนวนเงินที่ต้องเก็บต่อเดือน
    const monthsLeft = daysLeft / 30;
    const monthlyRequired =
      monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : 0;

    const goalObj = goal.toJSON ? goal.toJSON() : goal;

    return {
      ...goalObj,
      progress: Math.round(progress * 100) / 100,
      remaining,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      monthlyRequired,
      isOverdue: daysLeft < 0 && goal.status === GoalStatus.ACTIVE,
    };
  }
}
