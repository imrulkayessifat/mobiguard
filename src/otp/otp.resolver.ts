import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { Otp } from './dto/otp.dto';
import { OtpService } from './otp.service';

@Resolver(() => Otp)
export class OtpResolver {
  constructor(private otpService: OtpService) {}

  @Mutation(() => Otp, { name: 'createOtp' })
  async createOtp(@Args('phone_no') phone_no: string) {
    return await this.otpService.createOtp(phone_no);
  }

  @Query(() => Otp)
  async validateOtp(
    @Args('phone_no') phone_no: string,
    @Args('otp_code') otp_code: string,
  ) {
    return await this.otpService.validateOtp(phone_no, otp_code);
  }
}
