/* eslint-disable @typescript-eslint/await-thenable */
import * as path from 'path';
import * as fs from 'fs/promises';
import { Injectable, BadRequestException } from '@nestjs/common';

import { Flag } from './dto/lost.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { finished } from 'stream/promises';

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
    files?: FileUpload[],
  ) {
    const sanitizedPhoneNo = data.phone_no.replace(/[^a-zA-Z0-9]/g, '');
    const uploadDir = path.join(process.cwd(), 'uploads', sanitizedPhoneNo);

    await fs.mkdir(uploadDir, { recursive: true });

    const fileRecords = files?.length
      ? await Promise.all(
          files.map(async (documents) => {
            try {
              const file = await documents;

              if (!file?.filename) {
                throw new BadRequestException(
                  'Invalid file in upload - missing filename',
                );
              }

              const fileName = `${Date.now()}-${file.filename}`;
              const filePath = path.join(uploadDir, fileName);

              // Create a write stream to save the file
              const writeStream = createWriteStream(filePath);

              // Pipe the file stream to the write stream
              file.createReadStream().pipe(writeStream);

              // Wait for the stream to finish
              await finished(writeStream);

              return {
                url: `uploads/${sanitizedPhoneNo}/${fileName}`,
                name: file.filename,
              };
            } catch (error) {
              throw new BadRequestException(
                `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`,
              );
            }
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

  async update(id: number, flag: Flag) {
    return await this.prisma.lost.update({
      where: {
        id,
      },
      include: {
        files: true,
      },
      data: {
        flag,
      },
    });
  }
}
