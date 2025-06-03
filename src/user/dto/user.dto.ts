import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Imei } from 'src/imei/dto/imei.dto';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field()
  phone_no: string;

  @Field({ nullable: true })
  contact_email?: string;

  @Field({ nullable: true })
  emergency_contact?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [Imei])
  imeis: Imei[];
}
