import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
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
    try {
      const otp = await this.prisma.otp.findFirst({
        where: {
          OR: [{ phone_no }, { emergency_contact: phone_no }],
        },
      });

      if (!otp || otp.otp_code !== otp_code || otp.expire_time < new Date()) {
        return {
          access_token: null,
          user: null,
          message: 'Invalid or expired OTP',
          success: false,
          error: 'INVALID_OTP',
        };
      }

      // Get user details
      const user = await this.userService.findUserByPhoneNo(phone_no);

      if (!user) {
        return {
          access_token: null,
          user: null,
          message: 'User not found',
          success: false,
          error: 'USER_NOT_FOUND',
        };
      }

      // Generate JWT token
      const payload = {
        sub: user.id,
        ...user,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
        message: 'OTP validated successfully',
        success: true,
        error: null,
      };
    } catch (error: unknown) {
      const error_message =
        error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      return {
        access_token: null,
        user: null,
        message: 'An error occurred during OTP validation',
        success: false,
        error: error_message,
      };
    }
  }
}
