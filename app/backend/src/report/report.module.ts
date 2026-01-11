import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import {
  Transaction,
  TransactionSchema,
} from '../transaction/transaction-v2.schema';
import { Budget, BudgetSchema } from '../budget/budget.schema';
import { Category, CategorySchema } from '../category/category.schema';
import { Account, AccountSchema } from '../account/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
