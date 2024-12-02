import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Card } from '../card/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Card])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
