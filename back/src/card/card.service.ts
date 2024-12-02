import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { UpdateCardInfoDto } from './dto/update-card-info.dto';

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card) private readonly cardRepository: Repository<Card>
	) {}

	async updateCard(cardDto: UpdateCardInfoDto) {
		const card = await this.cardRepository.findOne({where: {id: cardDto.id}});

		if (!card) throw new NotFoundException('Card not found');

		card.name = cardDto.name ? cardDto.name : card.name;
		card.description = cardDto.description ? cardDto.description : card.description;

		await this.cardRepository.save(card);
	}
}
