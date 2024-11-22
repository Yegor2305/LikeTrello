import { IsEmail, Min } from 'class-validator';

export class BoardSharingDto {
	@IsEmail()
	email: string;

	@Min(1)
	boardId: number;
}