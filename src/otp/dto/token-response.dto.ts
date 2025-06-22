import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/dto/user.dto';

@ObjectType()
export class TokenResponse {
  @Field({ nullable: true }) access_token: string;
  @Field() success: boolean;
  @Field({ nullable: true }) error?: string;
  @Field(() => User, { nullable: true })
  user?: User;
}
