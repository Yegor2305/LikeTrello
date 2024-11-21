import {Controller, Get, Post, Param, UseGuards, Request, Body} from '@nestjs/common';
import { UserService } from './user.service';
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {CreateListDto} from "../list/dto/create-list.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('lists/:board_id')
  getLists(@Request() req, @Param('board_id') board_id: number) {
    return this.userService.getLists(req.user.id, board_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('first-board-lists')
  getFirstBoardList(@Request() req) {
    return this.userService.getFirstBoardLists(req.user.id);
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

}
