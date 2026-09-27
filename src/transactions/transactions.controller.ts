import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Body() createDepositDto: CreateDepositDto) {
    return this.transactionsService.deposit(createDepositDto);
  }

  @Post('transfer')
  transfer(@Body() createTransferDto: CreateTransferDto) {
    return this.transactionsService.transfer(createTransferDto);
  }
}
