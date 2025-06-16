import { Field, ObjectType } from '@nestjs/graphql';
import { Otp } from './otp.dto';

@ObjectType()
export class OtpResponse {
  @Field()
  status_code: number;

  @Field()
  message: string;

  @Field(() => Otp, { nullable: true })
  data?: string;
}
