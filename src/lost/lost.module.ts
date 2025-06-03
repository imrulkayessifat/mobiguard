import { Module } from '@nestjs/common';

import { LostService } from './lost.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LostService, PrismaService],
})
export class LostModule {}
