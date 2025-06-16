import { Module } from '@nestjs/common';

import { LostService } from './lost.service';
import { LostResolver } from './lost.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LostService, LostResolver, PrismaService],
})
export class LostModule {}
