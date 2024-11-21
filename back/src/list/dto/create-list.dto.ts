import {IsNotEmpty, Min} from "class-validator";

export class CreateListDto {
    @IsNotEmpty()
    name: string;

    @Min(1)
    boardId: number;
}
