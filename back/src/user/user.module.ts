import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {List} from "../list/entities/list.entity";
import { MailerModule } from '../mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Shared } from '../shared/entities/shared.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, List, Shared]),
    MailerModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_VALIDITY_DURATION_IN_HOURS') },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
