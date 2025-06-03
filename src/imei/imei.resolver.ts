import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

import { Imei } from './dto/imei.dto';
import { ImeiService } from './imei.service';

@Resolver(() => Imei)
export class ImeiResolver {
  constructor(private imeiService: ImeiService) {}

  @Mutation(() => Imei, { name: 'createImei' })
  async createImei(
    @Args('imei_number') imei_number: string,
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('user_id', { type: () => Int }) user_id: number,
  ) {
    return await this.imeiService.createImei({
      imei_number,
      brand,
      model,
      user_id,
    });
  }

  @Query(() => [Imei], { name: 'userImeis' })
  async imeisByUserId(@Args('user_id', { type: () => Int }) user_id: number) {
    return await this.imeiService.findImeisByUserId(user_id);
  }

  @Query(() => Imei, { name: 'imei' })
  async findOne(@Args('imei_number') imei_number: string) {
    return await this.imeiService.findOne(imei_number);
  }

  @Mutation(() => Imei, { name: 'removeImei' })
  async remove(@Args('id', ParseIntPipe) id: number) {
    return await this.imeiService.remove(id);
  }
}
