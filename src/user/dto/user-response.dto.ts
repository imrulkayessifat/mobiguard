import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.dto';

@ObjectType()
export class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
