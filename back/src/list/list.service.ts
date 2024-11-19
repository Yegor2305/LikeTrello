import { Injectable } from '@nestjs/common';
import {CreateCardDto} from "../card/dto/create-card.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Card} from "../card/entities/card.entity";

@Injectable()
export class ListService {
  constructor(
      @InjectRepository(User) private readonly userRepository : Repository<User>,
      @InjectRepository(Card) private readonly cardRepository : Repository<Card>,
  ) {}

  async addCard(userId: number, listId: number, cardDto: CreateCardDto) {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['lists', 'lists.cards']});
    const list = user.lists.find((list) => list.id === listId);

    if (user && list){
      const card = this.cardRepository.create({
        name: cardDto.name,
        list: list,
      })

      await this.cardRepository.save(card);

      if (!list.cards){
        list.cards = [];
      }
      list.cards.push(card);

      return list;
    }



  }

}
