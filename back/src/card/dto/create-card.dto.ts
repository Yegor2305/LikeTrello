import { IsNotEmpty, Min } from 'class-validator';

export class CreateCardDto {
    @IsNotEmpty()
    name: string;

    @Min(1)
    position?: number;

}
