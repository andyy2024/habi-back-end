import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  // 04 Check balance: At any time
  async getBalance(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: { balance: true }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return { balance: account.balance };
  }

  // 05 View history: Account transactions
  async getTransactions(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return transactions;
  }
}
