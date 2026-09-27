import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
