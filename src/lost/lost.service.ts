/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as path from 'path';
import * as fs from 'fs/promises';
import { Injectable, BadRequestException } from '@nestjs/common';

import { Flag } from './dto/lost.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LostService {
  constructor(private prisma: PrismaService) {}

  async createLost(
    data: {
      gd_number: string;
      phone_no: string;
      flag: Flag;
      imei_id: number;
    },
    files?: Express.Multer.File[],
  ) {
    const sanitizedPhoneNo = data.phone_no.replace(/[^a-zA-Z0-9]/g, '');
    const uploadDir = path.join(process.cwd(), 'uploads', sanitizedPhoneNo);

    await fs.mkdir(uploadDir, { recursive: true });

    const fileRecords = files?.length
      ? await Promise.all(
          files.map(async (file) => {
            if (!file?.originalname || !file?.buffer) {
              throw new BadRequestException('Invalid file in upload');
            }

            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, file.buffer);

            return {
              url: `uploads/${sanitizedPhoneNo}/${fileName}`,
              name: file.originalname,
            };
          }),
        )
      : [];

    return this.prisma.lost.create({
      data: {
        gd_number: data.gd_number,
        phone_no: data.phone_no,
        flag: data.flag,
        imei_id: data.imei_id,
        files: {
          create: fileRecords,
        },
      },
      include: {
        files: true,
      },
    });
  }

  async findLostsByImeiId(imei_id: number) {
    return await this.prisma.lost.findMany({
      where: { imei_id },
    });
  }
}
