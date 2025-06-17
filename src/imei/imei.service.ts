import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class ImeiService {
  constructor(private prisma: PrismaService) {}

  async createImei(data: {
    imei_number: string;
    brand: string;
    model: string;
    user_id: number;
  }) {
    return await this.prisma.imei.create({
      data,
    });
  }

  async findImeisByUserId(user_id: number) {
    const data = await this.prisma.imei.findMany({
      where: { user_id },
      include: {
        losts: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
    return data;
  }

  async findOne(imei_number: string) {
    const imei = await this.prisma.imei.findUnique({
      where: {
        imei_number,
      },
      include: {
        user: true,
      },
    });

    if (!imei) {
      throw new UserInputError(`Imei #${imei_number} does not exist`);
    }

    return imei;
  }

  async remove(id: number) {
    return await this.prisma.imei.delete({
      where: {
        id,
      },
    });
  }
}
