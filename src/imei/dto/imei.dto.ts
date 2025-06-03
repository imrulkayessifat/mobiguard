import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Imei {
  @Field(() => Int)
  id: number;

  @Field()
  imei_number: string;

  @Field()
  brand: string;

  @Field()
  model: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Int)
  user_id: number;
}
