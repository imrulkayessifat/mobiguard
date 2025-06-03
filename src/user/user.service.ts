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
    // Validate contact_email uniqueness if provided
    if (contact_email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: {
          contact_email,
          NOT: { id }, // Exclude the current user
        },
      });
      if (existingEmail) {
        throw new Error('Contact email is already in use');
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
        throw new Error('Emergency contact is already in use');
      }
    }

    // Update the user with provided fields
    return this.prisma.user.update({
      where: { id },
      data: {
        first_name,
        last_name,
        contact_email,
        emergency_contact,
        address,
      },
    });
  }
}
