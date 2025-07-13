import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { File } from 'src/file/dto/file.dto';

export enum Flag {
  LOST = 'LOST',
  FOUND = 'FOUND',
  STOLEN = 'STOLEN',
}

// Register the enum with GraphQL
registerEnumType(Flag, {
  name: 'Flag', // this is the name that will be used in the schema
});

@ObjectType()
export class Lost {
  @Field(() => Int)
  id: number;

  @Field()
  gd_number: string;

  @Field()
  phone_no: string;

  @Field(() => Flag) // Explicitly specify the enum type
  flag: Flag;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => Int)
  imei_id: number;

  @Field(() => [File], { nullable: true })
  files?: File[];
}
