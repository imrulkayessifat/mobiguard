import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ImeiService {
  constructor(private prisma: PrismaService) {}

  async createImei(data: {
    imei_number: string;
    brand: string;
    model: string;
    user_id: number;
  }) {
    const exist = await this.prisma.imei.findUnique({
      where: {
        imei_number: data.imei_number,
      },
    });
    if (exist) {
      return {
        imei: null,
        message: 'This IMEI is already registered.',
        success: false,
        error: 'IMEI_ALREADY_EXISTS',
      };
    }
    const imei = await this.prisma.imei.create({
      data,
    });
    return {
      imei: imei,
      message: 'IMEI registered successfully.',
      success: true,
    };
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
      return {
        message: `Imei #${imei_number} does not exist`,
        success: false,
        error: 'IMEI_NOT_EXIST',
        imei: null,
      };
    }

    return {
      message: 'IMEI matched. Device information retrieved',
      success: true,
      imei: imei,
    };
  }

  async remove(id: number) {
    try {
      const imei = await this.prisma.imei.delete({
        where: {
          id,
        },
      });
      return {
        imei: imei,
        message: 'Device deleted successfully.',
        success: true,
      };
    } catch (error: unknown) {
      const error_message =
        error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      return {
        imei: null,
        success: false,
        message: 'An error occurred while removing imei',
        error: error_message,
      };
    }
  }
}
