import {IsNotEmpty, MinLength} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @MinLength(6, {message: 'Password must be at least 6 characters'})
    password: string;
}
