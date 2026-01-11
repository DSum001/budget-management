import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Res,
  Param,
} from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('transactions/csv')
  async exportTransactions(
    @Request() req,
    @Res() res: Response,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    if (type) filters.type = type;
    if (categoryId) filters.categoryId = categoryId;
    if (accountId) filters.accountId = accountId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (tags) filters.tags = tags.split(',');
    if (search) filters.search = search;

    const csv = await this.exportService.exportTransactionsToCSV(
      req.user.userId,
      filters,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transactions.csv',
    );
    res.send(csv);
  }

  @Get('accounts/csv')
  async exportAccounts(@Request() req, @Res() res: Response) {
    const csv = await this.exportService.exportAccountsToCSV(req.user.userId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=accounts.csv');
    res.send(csv);
  }

  @Get('categories/csv')
  async exportCategories(@Request() req, @Res() res: Response) {
    const csv = await this.exportService.exportCategoriesToCSV(req.user.userId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');
    res.send(csv);
  }

  @Get('budgets/csv')
  async exportBudgets(@Request() req, @Res() res: Response) {
    const csv = await this.exportService.exportBudgetsToCSV(req.user.userId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=budgets.csv');
    res.send(csv);
  }

  @Get('saving-goals/csv')
  async exportSavingGoals(@Request() req, @Res() res: Response) {
    const csv = await this.exportService.exportSavingGoalsToCSV(
      req.user.userId,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=saving-goals.csv',
    );
    res.send(csv);
  }

  @Get('report/monthly/csv')
  async exportMonthlyReport(
    @Request() req,
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    const csv = await this.exportService.exportMonthlyReportToCSV(
      req.user.userId,
      monthNum,
      yearNum,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=monthly-report-${month}-${year}.csv`,
    );
    res.send(csv);
  }

  @Get('report/category-analysis/csv')
  async exportCategoryAnalysis(
    @Request() req,
    @Query('type') type: 'income' | 'expense',
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    const csv = await this.exportService.exportCategoryAnalysisToCSV(
      req.user.userId,
      type,
      monthNum,
      yearNum,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=category-analysis-${type}-${month}-${year}.csv`,
    );
    res.send(csv);
  }
}
