import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('dashboard')
  async getDashboard(
    @Request() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.reportService.getDashboard(req.user.userId, monthNum, yearNum);
  }

  @Get('income-expense-trend')
  async getIncomeExpenseTrend(
    @Request() req,
    @Query('groupBy') groupBy: 'day' | 'month' | 'year' = 'month',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportService.getIncomeExpenseTrend(
      req.user.userId,
      groupBy,
      start,
      end,
    );
  }

  @Get('category-analysis')
  async getCategoryAnalysis(
    @Request() req,
    @Query('type') type: 'income' | 'expense' = 'expense',
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.reportService.getCategoryAnalysis(
      req.user.userId,
      type,
      monthNum,
      yearNum,
    );
  }

  @Get('monthly-trend')
  async getMonthlyTrend(@Request() req, @Query('months') months?: string) {
    const monthsNum = months ? parseInt(months, 10) : 6;
    return this.reportService.getMonthlyTrend(req.user.userId, monthsNum);
  }

  @Get('top-expenses')
  async getTopExpenses(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.reportService.getTopExpenses(
      req.user.userId,
      limitNum,
      monthNum,
      yearNum,
    );
  }

  @Get('budget-performance')
  async getBudgetPerformance(
    @Request() req,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.reportService.getBudgetPerformance(
      req.user.userId,
      monthNum,
      yearNum,
    );
  }

  @Get('account-balance-history/:accountId')
  async getAccountBalanceHistory(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportService.getAccountBalanceHistory(
      req.user.userId,
      accountId,
      start,
      end,
    );
  }

  @Get('remaining-balance')
  async getRemainingBalance(
    @Request() req,
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportService.getRemainingBalance(
      req.user.userId,
      period,
      start,
      end,
    );
  }

  @Get('expenses-with-balance')
  async getExpensesWithBalance(
    @Request() req,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('categoryId') categoryId?: string,
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportService.getExpensesWithBalance(req.user.userId, {
      period,
      categoryId,
      accountId,
      startDate,
      endDate,
    });
  }
}
