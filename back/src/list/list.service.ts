import { BadRequestException, Injectable } from '@nestjs/common';
import {CreateCardDto} from "../card/dto/create-card.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Card} from "../card/entities/card.entity";
import {List} from "./entities/list.entity";
import { UpdateCardsInListDto } from '../card/dto/update-cards-in-list.dto';

@Injectable()
export class ListService {
  constructor(
      @InjectRepository(User) private readonly userRepository : Repository<User>,
      @InjectRepository(Card) private readonly cardRepository : Repository<Card>,
      @InjectRepository(List) private readonly listRepository : Repository<List>,
  ) {}

  async addCard(userId: number, listId: number, cardDto: CreateCardDto) {
    const list = await this.listRepository.findOne({where: {id: listId},
      relations: [
          'board',
          'board.user',
          'board.shared',
          'board.shared.userSharedWith',
          'cards',
      ]})

    if (list && list.board.user.id === userId ||
        list.board.shared.find(((shared) => shared.userSharedWith.id === userId))) {
      const card = this.cardRepository.create({
            name: cardDto.name,
            list: list,
            position: cardDto.position,
          })
      await this.cardRepository.save(card);

      if (!list.cards){
        list.cards = [];
      }

      list.cards.push(card);

      return true;
    }
    throw new BadRequestException('You have no permission to edit this');
  }

  async updateListCards(userId: number, listId: number, cardsDto: UpdateCardsInListDto) {
    const list = await this.listRepository.findOne({where: {id: listId},
      relations: [
        'board',
        'board.user',
        'board.shared',
        'board.shared.userSharedWith',
        'cards'
      ]})

    list.cards = [];

    if (list && list.board.user.id === userId ||
        list.board.shared.find(((shared) => shared.userSharedWith.id === userId))){
      for (const card of cardsDto.cards) {
        await this.cardRepository.update(card.id, {position: card.position, list: list});

        list.cards.push(await this.cardRepository.findOne({where: {id: card.id}}));
      }

      return list;
    }

    throw new BadRequestException('You have no permission to edit this');

  }
}
