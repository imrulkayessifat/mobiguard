import { ObjectType, Field, Int } from '@nestjs/graphql';

import { User } from 'src/user/dto/user.dto';
import { Lost } from 'src/lost/dto/lost.dto';

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

  @Field(() => User)
  user: User;

  @Field(() => [Lost], { nullable: true })
  losts?: Lost[];
}
