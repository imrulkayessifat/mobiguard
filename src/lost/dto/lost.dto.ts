import { ObjectType, Field, Int } from '@nestjs/graphql';

export enum Flag {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

@ObjectType()
export class Lost {
  @Field(() => Int)
  id: number;

  @Field()
  gd_number: string;

  @Field()
  phone_no: string;

  @Field()
  flag: Flag;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Int)
  imei_id: number;
}
