import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    username: string;

    @MinLength(6, {message: 'Password must be at least 6 characters'})
    password: string;
}
