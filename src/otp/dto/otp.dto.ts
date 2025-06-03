import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Otp {
  @Field(() => Int)
  id: number;

  @Field()
  phone_no: string;

  @Field()
  emergency_contact: string;

  @Field()
  otp_code: string;

  @Field()
  expire_time: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
