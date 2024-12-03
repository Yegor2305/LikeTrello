import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
  UsePipes,
  ValidationPipe,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CreateListDto } from "../list/dto/create-list.dto";
import { BoardSharingDto } from '../mailer/dto/board-sharing.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('board/:board_id')
  getBoard(@Request() req, @Param('board_id') board_id: number) {
    return this.userService.getBoard(req.user.id, board_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('first-board-lists')
  getFirstBoardList(@Request() req) {
    return this.userService.getFirstBoardLists(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('boards/:stringifyIds')
  getBoards(@Request() req, @Param('stringifyIds') stringifyIds: string) {
    return this.userService.getBoards(req.user.id, stringifyIds === 'true');
  }

  @UseGuards(JwtAuthGuard)
  @Get('shared-boards/:stringifyIds')
  getSharedBoards(@Request() req, @Param('stringifyIds') stringifyIds: string) {
    return this.userService.getSharedBoards(req.user.id, stringifyIds === 'true');
  }

  @Get('user/:username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-list')
  addList(@Request() req, @Body() createListDto: CreateListDto) {
    return this.userService.addList(req.user.id, createListDto);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('send-email')
  sendEmail(@Request() req, @Body() shareDto: BoardSharingDto){
    return this.userService.sendSharingEmail(req.user.id, shareDto.email, shareDto.boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('share-board-confirm')
  async confirmBoardSharing(@Query('token') token: string, @Request() req){
    return await this.userService.confirmBoardSharing(req.user.id, token);
  }

}
