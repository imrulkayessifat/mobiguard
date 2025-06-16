import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';

import { Lost, Flag } from './dto/lost.dto';
import { LostService } from './lost.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(() => Lost)
export class LostResolver {
  constructor(private lostService: LostService) {}

  @Mutation(() => Lost, { name: 'createLost' })
  async createLost(
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
      },
      files || [],
    );
  }

  @Query(() => [Lost])
  async lostsByImeiId(@Args('imei_id', { type: () => Int }) imei_id: number) {
    return await this.lostService.findLostsByImeiId(imei_id);
  }

  @Query(() => Lost)
  async updateFlag(
    @Args('id', { type: () => Int }) id: number,
    @Args('flag') flag: Flag,
  ) {
    return await this.lostService.update(id, flag);
  }
}
