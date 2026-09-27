import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(createDepositDto: CreateDepositDto) {
    const { accountId, amount, description } = createDepositDto;

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({ where: { id: accountId } });
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      // 02 Add balance
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          }
        }
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          amount: amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          receiverId: accountId,
          description: description || 'Deposit',
        }
      });

      return { transaction, balance: updatedAccount.balance };
    });
  }

  async transfer(createTransferDto: CreateTransferDto) {
    const { senderId, receiverId, amount, description } = createTransferDto;

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    return this.prisma.$transaction(async (tx) => {
      const sender = await tx.account.findUnique({ where: { id: senderId } });
      const receiver = await tx.account.findUnique({ where: { id: receiverId } });

      if (!sender) throw new BadRequestException('Sender account not found');
      if (!receiver) throw new BadRequestException('Receiver account not found');

      // Check balance (sender.balance is a Decimal, so we can compare it if we cast or use Number)
      if (Number(sender.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Deduct from sender
      await tx.account.update({
        where: { id: senderId },
        data: {
          balance: {
            decrement: amount,
          }
        }
      });

      // Add to receiver
      await tx.account.update({
        where: { id: receiverId },
        data: {
          balance: {
            increment: amount,
          }
        }
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          amount: amount,
          type: 'TRANSFER',
          status: 'COMPLETED',
          senderId: senderId,
          receiverId: receiverId,
          description: description || 'Transfer',
        }
      });

      return transaction;
    });
  }
}
