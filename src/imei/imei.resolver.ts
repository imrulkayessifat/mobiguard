import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { Imei } from './dto/imei.dto';
import { ImeiResponse } from './dto/imei-response.dto';
import { ImeiService } from './imei.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/dto/user.dto';

@Resolver(() => Imei)
export class ImeiResolver {
  constructor(private imeiService: ImeiService) {}

  @Mutation(() => ImeiResponse, { name: 'createImei' })
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async imeisByUserId(@CurrentUser() user: User) {
    console.log(user);
    return await this.imeiService.findImeisByUserId(user.id);
  }

  @Query(() => ImeiResponse, { name: 'imei' })
  async findOne(@Args('imei_number') imei_number: string) {
    return await this.imeiService.findOne(imei_number);
  }

  @Mutation(() => ImeiResponse, { name: 'removeImei' })
  @UseGuards(JwtAuthGuard)
  async remove(@Args('id', ParseIntPipe) id: number) {
    return await this.imeiService.remove(id);
  }
}
