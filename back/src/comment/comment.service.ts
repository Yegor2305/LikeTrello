import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveCommentDto } from './dto/leave-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Card } from '../card/entities/card.entity';

@Injectable()
export class CommentService {

  constructor(
      @InjectRepository(User) private readonly userRepository : Repository<User>,
      @InjectRepository(Comment) private readonly commentRepository : Repository<Comment>,
      @InjectRepository(Card) private readonly cardRepository : Repository<Card>,
  ) {}

  async leaveComment(authorId: number, commentDto: LeaveCommentDto) {
    const user = await this.userRepository.findOne({where: {id: authorId}});
    const card = await this.cardRepository.findOne({where: {id: commentDto.targetCardId}, relations: [
          'list',
          'list.board',
          'list.board.user',
          'list.board.shared',
          'list.board.shared.userSharedWith',
      ]});
    if (!user) throw new NotFoundException('User not found');

    if (!card) throw new NotFoundException('Card not found');

    if (card.list.board.user.id !== user.id ||
        !card.list.board.shared.find((shared) => shared.userSharedWith.id === user.id)) {
      throw new BadRequestException('You don\'t have permission to leave comment');
    }

    const comment = this.commentRepository.create({
      text: commentDto.text,
      author: user,
      card: card
    })

    await this.commentRepository.save(comment);

  }
}
