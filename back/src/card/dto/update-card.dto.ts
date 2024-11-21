import { Min } from 'class-validator';

export class UpdateCardDto {
	@Min(1)
	id: number

	@Min(1)
	position?: number
}
