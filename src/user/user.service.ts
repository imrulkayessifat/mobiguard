import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    first_name?: string;
    last_name?: string;
    phone_no: string;
    contact_email?: string;
    emergency_contact?: string;
    address?: string;
  }) {
    return await this.prisma.user.create({
      data,
    });
  }

  async findUserByPhoneNo(phone_no: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ phone_no }, { emergency_contact: phone_no }],
      },
    });
  }

  async update(
    id: number,
    first_name?: string,
    last_name?: string,
    contact_email?: string,
    emergency_contact?: string,
    address?: string,
  ) {
    try {
      // Validate contact_email uniqueness if provided
      if (contact_email) {
        const existingEmail = await this.prisma.user.findFirst({
          where: {
            contact_email,
            NOT: { id }, // Exclude the current user
          },
        });
        if (existingEmail) {
          return {
            message: 'Contact email is already in use',
            success: false,
            error: 'EMAIL_ALREADY_EXISTS',
            user: null,
          };
        }
      }

      // Validate emergency_contact uniqueness if provided and not null
      if (emergency_contact !== undefined && emergency_contact !== null) {
        const existingEmergencyContact = await this.prisma.user.findFirst({
          where: {
            emergency_contact,
            NOT: { id }, // Exclude the current user
          },
        });
        if (existingEmergencyContact) {
          return {
            message: 'Emergency contact is already in use',
            success: false,
            error: 'EMERGENCY_CONTACT_ALREADY_EXISTS',
            user: null,
          };
        }
      }

      // Update the user with provided fields
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          first_name,
          last_name,
          contact_email,
          emergency_contact,
          address,
        },
      });

      await this.prisma.otp.update({
        where: {
          phone_no: user.phone_no,
        },
        data: {
          emergency_contact,
        },
      });

      return {
        user,
        message: 'User updated successfully',
        success: true,
      };
    } catch (error: unknown) {
      const error_message =
        error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      return {
        message: 'An error occurred while updating user',
        success: false,
        error: error_message,
        user: null,
      };
    }
  }
}
