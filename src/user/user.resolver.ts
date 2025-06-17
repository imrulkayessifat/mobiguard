import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './dto/user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User, { name: 'createUser' })
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Args('first_name') first_name: string,
    @Args('last_name') last_name: string,
    @Args('phone_no') phone_no: string,
    @Args('contact_email') contact_email: string,
    @Args('emergency_contact') emergency_contact: string,
    @Args('address') address: string,
  ) {
    return await this.userService.createUser({
      first_name,
      last_name,
      phone_no,
      contact_email,
      emergency_contact,
      address,
    });
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async userByPhoneNo(@Args('phone_no') phone_no: string) {
    return await this.userService.findUserByPhoneNo(phone_no);
  }

  @Mutation(() => UserResponse, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id', ParseIntPipe) id: number,
    @Args('first_name') first_name: string,
    @Args('last_name') last_name: string,
    @Args('contact_email') contact_email: string,
    @Args('emergency_contact') emergency_contact: string,
    @Args('address') address: string,
  ) {
    return await this.userService.update(
      id,
      first_name,
      last_name,
      contact_email,
      emergency_contact,
      address,
    );
  }
}
