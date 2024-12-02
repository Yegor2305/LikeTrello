import { Body, Controller, Post, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { LeaveCommentDto } from './dto/leave-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('leave-comment')
  leaveComment(@Request() req, @Body() commentDto: LeaveCommentDto) {
    return this.commentService.leaveComment(req.user.id, commentDto);
  }

}
