import {Controller, Post, UseGuards, Request, Param, Body} from '@nestjs/common';
import { ListService } from './list.service';
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {CreateCardDto} from "../card/dto/create-card.dto";
import { UpdateCardsInListDto } from '../card/dto/update-cards-in-list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-card/:list_id')
  addList(@Request() req, @Param('list_id') list_id: number, @Body() createCardDto: CreateCardDto) {
    return this.listService.addCard(req.user.id, +list_id, createCardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-list-cards/:list_id')
  updateListCards(@Request() req, @Param('list_id') list_id: number,
                  @Body() updateCardsInListDto: UpdateCardsInListDto) {
    return this.listService.updateListCards(req.user.id, +list_id, updateCardsInListDto);
  }

}
