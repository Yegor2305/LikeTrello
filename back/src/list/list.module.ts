import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Card} from "../card/entities/card.entity";
import {User} from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
