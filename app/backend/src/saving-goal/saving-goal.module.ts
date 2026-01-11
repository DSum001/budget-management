import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingGoalService } from './saving-goal.service';
import { SavingGoalController } from './saving-goal.controller';
import { SavingGoal, SavingGoalSchema } from './saving-goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavingGoal.name, schema: SavingGoalSchema },
    ]),
  ],
  controllers: [SavingGoalController],
  providers: [SavingGoalService],
  exports: [SavingGoalService],
})
export class SavingGoalModule {}
