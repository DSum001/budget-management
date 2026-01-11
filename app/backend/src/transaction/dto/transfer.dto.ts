import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class TransferDto {
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Please select source account' })
  fromAccountId: string;

  @IsString()
  @IsNotEmpty({ message: 'Please select destination account' })
  toAccountId: string;

  @IsDateString({}, { message: 'Invalid date format' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter description' })
  description: string;
}
