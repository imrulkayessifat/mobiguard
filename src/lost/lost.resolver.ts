import { UseGuards } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';

import { Lost, Flag } from './dto/lost.dto';
import { LostService } from './lost.service';
import { User } from 'src/user/dto/user.dto';
import { LostResponse } from './dto/lost-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => Lost)
export class LostResolver {
  constructor(private lostService: LostService) {}

  @Mutation(() => LostResponse, { name: 'createLost' })
  @UseGuards(JwtAuthGuard)
  async createLost(
    @CurrentUser() user: User,
    @Args('gd_number') gd_number: string,
    @Args('phone_no') phone_no: string,
    @Args('flag') flag: Flag,
    @Args('imei_id', { type: () => Int }) imei_id: number,
    @Args('files', { type: () => [GraphQLUpload], nullable: true })
    files?: FileUpload[],
  ) {
    return await this.lostService.createLost(
      {
        gd_number,
        phone_no,
        flag,
        imei_id,
        user_id: user.id,
      },
      files || [],
    );
  }

  @Query(() => [Lost])
  @UseGuards(JwtAuthGuard)
  async lostsByImeiId(@Args('imei_id', { type: () => Int }) imei_id: number) {
    return await this.lostService.findLostsByImeiId(imei_id);
  }

  @Query(() => LostResponse)
  @UseGuards(JwtAuthGuard)
  async updateFlag(
    @Args('id', { type: () => Int }) id: number,
    @Args('flag') flag: Flag,
  ) {
    return await this.lostService.update(id, flag);
  }
}
