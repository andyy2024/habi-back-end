import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
