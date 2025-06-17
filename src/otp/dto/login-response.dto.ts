import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/dto/user.dto';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  access_token?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
