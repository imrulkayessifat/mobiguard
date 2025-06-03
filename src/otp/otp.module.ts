import { Module } from '@nestjs/common';

import { OtpService } from './otp.service';
import { OtpResolver } from './otp.resolver';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [OtpService, UserService, OtpResolver, PrismaService],
})
export class OtpModule {}
