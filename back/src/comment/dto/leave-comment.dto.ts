import { IsNotEmpty, Min } from 'class-validator';

export class LeaveCommentDto {
	@IsNotEmpty()
	text: string;

	@Min(1)
	targetCardId: number;
}
