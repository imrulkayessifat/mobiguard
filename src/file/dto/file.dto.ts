import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @Field()
  name: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Int)
  lost_id: number;
}
