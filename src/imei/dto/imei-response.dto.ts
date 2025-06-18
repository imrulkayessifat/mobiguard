import { ObjectType, Field } from '@nestjs/graphql';
import { Imei } from './imei.dto';

@ObjectType()
export class ImeiResponse {
  @Field(() => Imei, { nullable: true })
  imei?: Imei;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  error?: string;
}
