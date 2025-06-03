import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createOtp(phone_no: string) {
    const user = await this.userService.findUserByPhoneNo(phone_no);
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const expire_time = new Date(Date.now() + 30 * 1000); // 30 seconds from now

    if (!user) {
      await this.userService.createUser({ phone_no });
      return await this.prisma.otp.create({
        data: {
          phone_no,
          otp_code,
          expire_time,
        },
      });
    }

    return await this.updateOtp(phone_no, otp_code, expire_time);
  }

  async updateOtp(phone_no: string, otp_code: string, expire_time: Date) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        OR: [{ phone_no }, { emergency_contact: phone_no }],
      },
    });

    if (!otp) {
      throw new Error(
        'No OTP record found for the provided phone number or emergency contact',
      );
    }

    return this.prisma.otp.update({
      where: {
        id: otp.id,
      },
      data: {
        otp_code,
        expire_time,
      },
    });
  }

  async validateOtp(phone_no: string, otp_code: string) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        OR: [{ phone_no }, { emergency_contact: phone_no }],
      },
    });

    if (!otp || otp.otp_code !== otp_code || otp.expire_time < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    return otp;
  }
}
