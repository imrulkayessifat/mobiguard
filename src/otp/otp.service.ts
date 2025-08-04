import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

const logger = new Logger('YourServiceName');

import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone_no: string;
  contact_email: string | null;
  emergency_contact: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
  sub: number;
}

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
    const expire_time = new Date(Date.now() + 60 * 1000); // 60 seconds from now

    const sentOtp = await fetch(
      `https://api.mobireach.com.bd/SendTextMessage?Username=asdev1&Password=Dhaka@5599&From=8801841504032&To=${phone_no}&Message=${otp_code}`,
    );
    if (sentOtp.status !== 200) {
      throw new Error('Otp does not sent!');
    }
    logger.log('Send Otp : ', sentOtp);
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

    const res = await this.updateOtp(phone_no, otp_code, expire_time);
    logger.log('phone_no : ', phone_no);
    logger.log('response : ', res);
    return res;
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
          refresh_token: null,
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
          refresh_token: null,
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

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token,
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
        refresh_token: null,
        user: null,
        message: 'An error occurred during OTP validation',
        success: false,
        error: error_message,
      };
    }
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refresh_token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByPhoneNo(payload.phone_no);

      if (!user) {
        return {
          access_token: null,
          success: false,
          user: null,
          error: 'INVALID_TOKEN',
        };
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      );

      return { access_token: newAccessToken, user: user, success: true };
    } catch {
      return {
        access_token: null,
        success: false,
        user: null,
        error: 'TOKEN_EXPIRED',
      };
    }
  }
}
