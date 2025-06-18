import { ObjectType, Field } from '@nestjs/graphql';
import { Lost } from './lost.dto';

@ObjectType()
export class LostResponse {
  @Field(() => Lost, { nullable: true })
  lost?: Lost;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
