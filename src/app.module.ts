import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppService } from './app.service';
import { OtpModule } from './otp/otp.module';
import { ImeiModule } from './imei/imei.module';
import { UserModule } from './user/user.module';
import { LostModule } from './lost/lost.module';
import { FileModule } from './file/file.module';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: false,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    OtpModule,
    UserModule,
    ImeiModule,
    LostModule,
    FileModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
