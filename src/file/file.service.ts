import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async createFile(data: { url: string; name: string; lost_id: number }) {
    return await this.prisma.file.create({
      data,
    });
  }

  async findFilesByLostId(lost_id: number) {
    return await this.prisma.file.findMany({
      where: { lost_id },
    });
  }
}
