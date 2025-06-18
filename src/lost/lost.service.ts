/* eslint-disable @typescript-eslint/await-thenable */
import * as path from 'path';
import * as fs from 'fs/promises';
import { Injectable } from '@nestjs/common';

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

    try {
      await fs.mkdir(uploadDir, { recursive: true });

      const fileRecords: {
        url: string;
        name: string;
      }[] = [];

      if (files?.length) {
        for (const documents of files) {
          try {
            const file = await documents;

            if (!file?.filename) {
              return {
                lost: null,
                message: 'Invalid file in upload - missing filename',
                success: false,
                error: 'MISSING_FILENAME',
              };
            }

            const fileName = `${Date.now()}-${file.filename}`;
            const filePath = path.join(uploadDir, fileName);

            const writeStream = createWriteStream(filePath);
            file.createReadStream().pipe(writeStream);
            await finished(writeStream);

            fileRecords.push({
              url: `uploads/${sanitizedPhoneNo}/${fileName}`,
              name: file.filename,
            });
          } catch (error) {
            return {
              lost: null,
              message: `Failed to process file: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
              success: false,
              error: 'FILE_UPLOAD_FAILED',
            };
          }
        }
      }

      const lost = await this.prisma.lost.create({
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

      return {
        lost,
        message: 'Lost data created successfully.',
        success: true,
      };
    } catch (err) {
      return {
        lost: null,
        message: err instanceof Error ? err.message : 'Something went wrong',
        success: false,
        error: 'CREATE_LOST_FAILED',
      };
    }
  }

  async findLostsByImeiId(imei_id: number) {
    return await this.prisma.lost.findMany({
      where: { imei_id },
    });
  }

  async update(id: number, flag: Flag) {
    const lost = await this.prisma.lost.update({
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

    return {
      message: 'Device marked as recovered.',
      success: true,
      error: 'DEVICE_RECOVERED',
      lost: lost,
    };
  }
}
