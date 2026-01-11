import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../transaction/transaction-v2.schema';
import { Budget } from '../budget/budget.schema';
import { Category } from '../category/category.schema';
import { Account } from '../account/account.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async getDashboard(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // รายได้และค่าใช้จ่ายในเดือนนี้
    const incomeExpense = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const income =
      incomeExpense.find((item) => item._id === 'income')?.total || 0;
    const expense =
      incomeExpense.find((item) => item._id === 'expense')?.total || 0;

    // รายการตามหมวดหมู่
    const byCategory = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          categoryId: '$_id.category',
          categoryName: '$categoryInfo.name',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // รายการตามบัญชี
    const byAccount = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$account',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'accountInfo',
        },
      },
      {
        $unwind: { path: '$accountInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          accountId: '$_id',
          accountName: '$accountInfo.name',
          accountType: '$accountInfo.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // รายการล่าสุด
    const recentTransactions = await this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .limit(10)
      .populate('category', 'name icon')
      .populate('account', 'name type')
      .lean();

    return {
      overview: {
        income,
        expense,
        balance: income - expense,
        month: targetMonth,
        year: targetYear,
      },
      byCategory,
      byAccount,
      recentTransactions,
    };
  }

  async getIncomeExpenseTrend(
    userId: string,
    groupBy: 'day' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date,
  ) {
    const now = new Date();
    const start =
      startDate || new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let groupStage: any;
    if (groupBy === 'day') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      };
    } else if (groupBy === 'month') {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      };
    } else {
      groupStage = {
        $group: {
          _id: {
            year: { $year: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      };
    }

    const data = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      groupStage,
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    return data;
  }

  async getCategoryAnalysis(
    userId: string,
    type: 'income' | 'expense',
    month?: number,
    year?: number,
  ) {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const analysis = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$categoryInfo.name',
          categoryIcon: '$categoryInfo.icon',
          categoryColor: '$categoryInfo.color',
          total: 1,
          count: 1,
          avgAmount: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalAmount = analysis.reduce((sum, item) => sum + item.total, 0);

    return {
      month: targetMonth,
      year: targetYear,
      type,
      totalAmount,
      categories: analysis.map((item) => ({
        ...item,
        percentage: totalAmount > 0 ? (item.total / totalAmount) * 100 : 0,
      })),
    };
  }

  async getMonthlyTrend(userId: string, months: number = 6) {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - months + 1,
      1,
    );
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const trend = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
            },
          },
          transactions: { $sum: '$count' },
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expense: 1,
          balance: { $subtract: ['$income', '$expense'] },
          transactions: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return trend;
  }

  async getTopExpenses(
    userId: string,
    limit: number = 10,
    month?: number,
    year?: number,
  ) {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const topExpenses = await this.transactionModel
      .find({
        userId: new Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ amount: -1 })
      .limit(limit)
      .populate('category', 'name icon color')
      .populate('account', 'name type')
      .lean();

    return {
      month: targetMonth,
      year: targetYear,
      expenses: topExpenses,
    };
  }

  async getBudgetPerformance(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // หา budgets ที่ active ในเดือนนี้
    const budgets = await this.budgetModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: true,
        startDate: { $lte: endDate },
        $or: [{ endDate: { $gte: startDate } }, { endDate: null }],
      })
      .populate('category', 'name icon color')
      .lean();

    const performance = [];

    for (const budget of budgets) {
      // คำนวณค่าใช้จ่ายจริง
      const actualExpense = await this.transactionModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            type: 'expense',
            // @ts-ignore
            categoryId: budget.categoryId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      const spent = actualExpense[0]?.total || 0;
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;
      const status =
        percentage >= 100
          ? 'over_budget'
          : percentage >= (budget.alertThreshold || 80)
            ? 'warning'
            : 'on_track';

      // @ts-ignore
      performance.push({
        budgetId: budget._id,
        budgetName: budget.name,
        // @ts-ignore
        category: budget.category,
        budgetAmount: budget.amount,
        spent,
        remaining,
        percentage,
        status,
        period: budget.period,
      });
    }

    return {
      month: targetMonth,
      year: targetYear,
      budgets: performance,
    };
  }

  async getAccountBalanceHistory(
    userId: string,
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate || now;

    const account = await this.accountModel.findOne({
      _id: new Types.ObjectId(accountId),
      userId: new Types.ObjectId(userId),
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = await this.transactionModel
      .find({
        userId: new Types.ObjectId(userId),
        account: new Types.ObjectId(accountId),
        date: { $gte: start, $lte: end },
      })
      .sort({ date: 1 })
      .lean();

    let balance = account.balance;
    const history = transactions.map((tx) => {
      if (tx.type === 'income') {
        balance -= tx.amount;
      } else {
        balance += tx.amount;
      }
      return {
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        balanceBefore: balance,
        balanceAfter: account.balance,
      };
    });

    // กลับลำดับเพื่อคำนวณ balance ย้อนหลัง
    history.reverse();
    balance = account.balance;
    for (const item of history) {
      item.balanceAfter = balance;
      if (transactions.find((tx) => tx.date === item.date)?.type === 'income') {
        balance -= item.amount;
      } else {
        balance += item.amount;
      }
      item.balanceBefore = balance;
    }
    history.reverse();

    return {
      account: {
        id: account._id,
        name: account.name,
        type: account.type,
        currentBalance: account.balance,
      },
      startDate: start,
      endDate: end,
      history,
    };
  }

  async getRemainingBalance(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly',
    startDate?: Date,
    endDate?: Date,
  ) {
    const now = new Date();
    let start: Date;
    let end: Date;

    // กำหนดช่วงเวลาตามช่วงที่เลือก
    if (period === 'daily') {
      start =
        startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end =
        endDate ||
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (period === 'weekly') {
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // จันทร์เป็นวันแรกของสัปดาห์
      start =
        startDate ||
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
      end =
        endDate ||
        new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() + 6,
          23,
          59,
          59,
        );
    } else {
      // monthly
      start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
      end =
        endDate ||
        new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    // ดึงข้อมูลรายได้และค่าใช้จ่ายในช่วงเวลา
    const transactions = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = transactions.find((t) => t._id === 'income')?.total || 0;
    const expense = transactions.find((t) => t._id === 'expense')?.total || 0;

    // ดึงยอดเงินทั้งหมดในบัญชี
    const accounts = await this.accountModel.find({
      userId: new Types.ObjectId(userId),
      includeInTotal: true,
      isArchived: false,
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // คำนวณรายได้-ค่าใช้จ่ายในช่วงเวลา
    const netAmount = income - expense;

    // รายละเอียดตามหมวดหมู่
    const expenseByCategory = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$categoryInfo.name',
          categoryIcon: '$categoryInfo.icon',
          categoryColor: '$categoryInfo.color',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // ตรวจสอบงบประมาณในช่วงเวลานี้
    let budgetInfo = null;
    const budgets = await this.budgetModel.find({
      userId: new Types.ObjectId(userId),
      isActive: true,
      period:
        period === 'daily'
          ? 'daily'
          : period === 'weekly'
            ? 'weekly'
            : 'monthly',
      startDate: { $lte: end },
      $or: [{ endDate: { $gte: start } }, { endDate: null }],
    });

    if (budgets.length > 0) {
      const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
      const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
      budgetInfo = {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        percentage: (totalSpent / totalBudget) * 100,
      };
    }

    return {
      period,
      startDate: start,
      endDate: end,
      summary: {
        totalIncome: income,
        totalExpense: expense,
        netAmount,
        currentBalance: totalBalance,
      },
      expenseByCategory,
      budget: budgetInfo,
      accounts: accounts.map((acc) => ({
        id: acc._id,
        name: acc.name,
        type: acc.type,
        balance: acc.balance,
      })),
    };
  }

  async getExpensesWithBalance(
    userId: string,
    filters: {
      period?: 'daily' | 'weekly' | 'monthly';
      categoryId?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (filters.startDate && filters.endDate) {
      start = new Date(filters.startDate);
      end = new Date(filters.endDate);
    } else if (filters.period) {
      if (filters.period === 'daily') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
        );
      } else if (filters.period === 'weekly') {
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - diff,
        );
        end = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() + 6,
          23,
          59,
          59,
        );
      } else {
        // monthly
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      }
    } else {
      // default to current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const query: any = {
      userId: new Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    };

    if (filters.categoryId) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    if (filters.accountId) {
      query.accountId = new Types.ObjectId(filters.accountId);
    }

    // ดึงรายการค่าใช้จ่าย
    const expenses = await this.transactionModel
      .find({ ...query, type: 'expense' })
      .populate('categoryId', 'name icon color')
      .populate('accountId', 'name type')
      .sort({ date: -1 })
      .exec();

    // ดึงรายได้
    const incomeData = await this.transactionModel.aggregate([
      {
        $match: {
          ...query,
          type: 'income',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalIncome = incomeData.length > 0 ? incomeData[0].total : 0;
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      period: filters.period || 'monthly',
      startDate: start,
      endDate: end,
      summary: {
        totalIncome,
        totalExpense,
        remaining: totalIncome - totalExpense,
      },
      expenses: expenses.map((exp) => ({
        id: exp._id,
        amount: exp.amount,
        description: exp.description,
        date: exp.date,
        category: exp.categoryId,
        account: exp.accountId,
        note: exp.note,
        tags: exp.tags,
      })),
    };
  }
}
