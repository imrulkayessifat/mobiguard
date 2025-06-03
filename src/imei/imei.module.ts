import { Module } from '@nestjs/common';

import { ImeiService } from './imei.service';
import { ImeiResolver } from './imei.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ImeiService, ImeiResolver, PrismaService],
})
export class ImeiModule {}
