import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';

import { Lost, Flag } from './dto/lost.dto';
import { LostService } from './lost.service';

@Resolver(() => Lost)
export class LostResolver {
  constructor(private lostService: LostService) {}

  @Mutation(() => Lost)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async createLost(
    @Args('gd_number') gd_number: string,
    @Args('phone_no') phone_no: string,
    @Args('flag') flag: Flag,
    @Args('imei_id', { type: () => Int }) imei_id: number,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ) {
    return await this.lostService.createLost(
      {
        gd_number,
        phone_no,
        flag,
        imei_id,
      },
      files.files || [],
    );
  }

  @Query(() => [Lost])
  async lostsByImeiId(@Args('imei_id', { type: () => Int }) imei_id: number) {
    return await this.lostService.findLostsByImeiId(imei_id);
  }

  @Query(() => [Lost])
  async update(
    @Args('id', { type: () => Int }) id: number,
    @Args('flag') flag: Flag,
  ) {
    return await this.lostService.update(id, flag);
  }
}
