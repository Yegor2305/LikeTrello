import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateCardInfoDto } from './dto/update-card-info.dto';

@Controller('card')
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@UseGuards(JwtAuthGuard)
	@Patch('update')
	async updateCard(@Body() cardDto: UpdateCardInfoDto) {
		return await this.cardService.updateCard(cardDto);
	}
}
