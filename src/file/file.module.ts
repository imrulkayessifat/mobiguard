import { Module } from '@nestjs/common';

import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FileService, FileResolver, PrismaService],
})
export class FileModule {}
