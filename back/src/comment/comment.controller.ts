import { Body, Controller, Post, UseGuards, Request, UsePipes, ValidationPipe, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { LeaveCommentDto } from './dto/leave-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('get-comments/:cardId')
  async getComments(@Param('cardId') cardId: string) {
    return await this.commentService.getComments(+cardId)
  }


  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('leave-comment')
  leaveComment(@Request() req, @Body() commentDto: LeaveCommentDto) {
    return this.commentService.leaveComment(req.user.id, commentDto);
  }

}
