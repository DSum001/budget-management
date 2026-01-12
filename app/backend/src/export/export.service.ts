import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../transaction/transaction-v2.schema';
import { Account } from '../account/account.schema';
import { Category } from '../category/category.schema';
import { Budget } from '../budget/budget.schema';
import { SavingGoal } from '../saving-goal/saving-goal.schema';

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(SavingGoal.name) private savingGoalModel: Model<SavingGoal>,
  ) {}

  async exportTransactionsToCSV(
    userId: string,
    filters?: {
      type?: string;
      categoryId?: string;
      accountId?: string;
      startDate?: Date;
      endDate?: Date;
      tags?: string[];
      search?: string;
    },
  ): Promise<string> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filters?.type) query.type = filters.type;
    if (filters?.categoryId)
      query.category = new Types.ObjectId(filters.categoryId);
    if (filters?.accountId)
      query.account = new Types.ObjectId(filters.accountId);
    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters?.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { note: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const transactions = await this.transactionModel
      .find(query)
      .populate('category', 'name')
      .populate('account', 'name')
      .sort({ date: -1 })
      .lean();

    // สร้าง CSV header
    const headers = [
      'Date',
      'Type',
      'Category',
      'Account',
      'Amount',
      'Description',
      'Note',
      'Tags',
      'Location',
      'Is Recurring',
      'Recurring Frequency',
      'Created At',
    ];

    // สร้าง CSV rows
    const rows = transactions.map((tx) => {
      // @ts-ignore - populated fields
      return [
        this.formatDate(tx.date),
        tx.type,
        // @ts-ignore
        (tx.category as any)?.name || '',
        // @ts-ignore
        (tx.account as any)?.name || '',
        tx.amount.toString(),
        this.escapeCSV(tx.description || ''),
        this.escapeCSV(tx.note || ''),
        tx.tags ? tx.tags.join('; ') : '',
        this.escapeCSV(tx.location || ''),
        tx.isRecurring ? 'Yes' : 'No',
        tx.recurringFrequency || '',
        // @ts-ignore
        this.formatDate(tx.createdAt),
      ];
    });

    // รวม header และ rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  async exportAccountsToCSV(userId: string): Promise<string> {
    const accounts = await this.accountModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ name: 1 })
      .lean();

    const headers = [
      'Name',
      'Type',
      'Balance',
      'Currency',
      'Include In Total',
      'Is Archived',
      'Institution',
      'Account Number',
      'Description',
      'Created At',
    ];

    const rows = accounts.map((account) => [
      this.escapeCSV(account.name),
      account.type,
      account.balance.toString(),
      account.currency,
      account.includeInTotal ? 'Yes' : 'No',
      account.isArchived ? 'Yes' : 'No',
      // @ts-ignore
      this.escapeCSV(account.institution || ''),
      this.escapeCSV(account.accountNumber || ''),
      // @ts-ignore
      this.escapeCSV(account.description || ''),
      // @ts-ignore
      this.formatDate(account.createdAt),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  async exportCategoriesToCSV(userId: string): Promise<string> {
    const categories = await this.categoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('parentId', 'name')
      .sort({ name: 1 })
      .lean();

    const headers = [
      'Name',
      'Type',
      'Parent Category',
      'Icon',
      'Color',
      'Is System',
      'Created At',
    ];

    const rows = categories.map((category) => [
      this.escapeCSV(category.name),
      category.type,
      (category.parentId as any)?.name || '',
      category.icon || '',
      category.color || '',
      category.isSystem ? 'Yes' : 'No',
      // @ts-ignore
      this.formatDate(category.createdAt),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  async exportBudgetsToCSV(userId: string): Promise<string> {
    const budgets = await this.budgetModel
      .find({ userId: userId })
      .populate('category', 'name')
      .sort({ startDate: -1 })
      .lean();

    const headers = [
      'Name',
      'Category',
      'Amount',
      'Spent',
      'Period',
      'Start Date',
      'End Date',
      'Alert Enabled',
      'Alert Threshold',
      'Is Active',
      'Created At',
    ];

    const rows = budgets.map((budget) => [
      this.escapeCSV(budget.name),
      // @ts-ignore
      (budget.category as any)?.name || '',
      budget.amount.toString(),
      budget.spent.toString(),
      budget.period,
      this.formatDate(budget.startDate),
      budget.endDate ? this.formatDate(budget.endDate) : '',
      budget.alertEnabled ? 'Yes' : 'No',
      budget.alertThreshold.toString(),
      budget.isActive ? 'Yes' : 'No',
      // @ts-ignore
      this.formatDate(budget.createdAt),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  async exportSavingGoalsToCSV(userId: string): Promise<string> {
    const goals = await this.savingGoalModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('linkedAccountId', 'name')
      .sort({ targetDate: 1 })
      .lean();

    const headers = [
      'Name',
      'Description',
      'Target Amount',
      'Current Amount',
      'Target Date',
      'Status',
      'Linked Account',
      'Completed At',
      'Created At',
    ];

    const rows = goals.map((goal) => [
      this.escapeCSV(goal.name),
      this.escapeCSV(goal.description || ''),
      goal.targetAmount.toString(),
      goal.currentAmount.toString(),
      this.formatDate(goal.targetDate),
      goal.status,
      (goal.linkedAccountId as any)?.name || '',
      goal.completedAt ? this.formatDate(goal.completedAt) : '',
      // @ts-ignore
      this.formatDate(goal.createdAt),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  async exportMonthlyReportToCSV(
    userId: string,
    month: number,
    year: number,
  ): Promise<string> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await this.transactionModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      })
      .populate('category', 'name')
      .populate('account', 'name')
      .sort({ date: 1 })
      .lean();

    // คำนวณสรุป
    const income = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    // สร้าง CSV
    const headers = [
      'Date',
      'Type',
      'Category',
      'Account',
      'Amount',
      'Description',
      'Note',
      'Tags',
    ];

    const summaryRows = [
      ['MONTHLY SUMMARY'],
      ['Month', `${month}/${year}`],
      ['Total Income', income.toString()],
      ['Total Expense', expense.toString()],
      ['Balance', (income - expense).toString()],
      [''],
      ['TRANSACTIONS'],
    ];

    const transactionRows = transactions.map((tx) => [
      this.formatDate(tx.date),
      tx.type,
      // @ts-ignore
      (tx.category as any)?.name || '',
      // @ts-ignore
      (tx.account as any)?.name || '',
      tx.amount.toString(),
      this.escapeCSV(tx.description || ''),
      this.escapeCSV(tx.note || ''),
      tx.tags ? tx.tags.join('; ') : '',
    ]);

    return [
      ...summaryRows.map((row) => row.join(',')),
      headers.join(','),
      ...transactionRows.map((row) => row.join(',')),
    ].join('\n');
  }

  async exportCategoryAnalysisToCSV(
    userId: string,
    type: 'income' | 'expense',
    month: number,
    year: number,
  ): Promise<string> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

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
          categoryName: '$categoryInfo.name',
          total: 1,
          count: 1,
          avgAmount: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalAmount = analysis.reduce((sum, item) => sum + item.total, 0);

    const headers = [
      'Category',
      'Total Amount',
      'Transaction Count',
      'Average Amount',
      'Percentage',
    ];

    const rows = analysis.map((item) => [
      this.escapeCSV(item.categoryName || 'Uncategorized'),
      item.total.toFixed(2),
      item.count.toString(),
      item.avgAmount.toFixed(2),
      totalAmount > 0
        ? ((item.total / totalAmount) * 100).toFixed(2) + '%'
        : '0%',
    ]);

    const summaryRows = [
      ['CATEGORY ANALYSIS REPORT'],
      ['Type', type],
      ['Period', `${month}/${year}`],
      ['Total Amount', totalAmount.toFixed(2)],
      [''],
    ];

    return [
      ...summaryRows.map((row) => row.join(',')),
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');
  }

  private formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private escapeCSV(value: string): string {
    if (!value) return '';
    // หากมี comma, double quote, หรือ newline ต้องใส่ double quote รอบข้างและ escape double quote
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
