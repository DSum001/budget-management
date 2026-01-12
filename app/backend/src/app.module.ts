import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { BudgetModule } from './budget/budget.module';
import { SavingGoalModule } from './saving-goal/saving-goal.module';
import { ReportModule } from './report/report.module';
import { ExportModule } from './export/export.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
      },
    ]),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-management',
    ),
    LoggerModule,
    AuthModule,
    UserModule,
    AccountModule,
    CategoryModule,
    BudgetModule,
    SavingGoalModule,
    ReportModule,
    ExportModule,
    TransactionModule,
  ],
})
export class AppModule {}
