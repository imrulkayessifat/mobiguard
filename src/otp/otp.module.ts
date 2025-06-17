import { Module } from '@nestjs/common';

import { OtpService } from './otp.service';
import { OtpResolver } from './otp.resolver';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OtpService, UserService, OtpResolver, PrismaService],
})
export class OtpModule {}
