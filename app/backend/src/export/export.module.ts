import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import {
  Transaction,
  TransactionSchema,
} from '../transaction/transaction-v2.schema';
import { Account, AccountSchema } from '../account/account.schema';
import { Category, CategorySchema } from '../category/category.schema';
import { Budget, BudgetSchema } from '../budget/budget.schema';
import {
  SavingGoal,
  SavingGoalSchema,
} from '../saving-goal/saving-goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: SavingGoal.name, schema: SavingGoalSchema },
    ]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
