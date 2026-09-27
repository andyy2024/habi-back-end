import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 01 Create an account: A user with a balance.
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        account: {
          create: {
            balance: 0.00,
          }
        }
      },
      include: {
        account: true,
      }
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include: { account: true } });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { account: true }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
