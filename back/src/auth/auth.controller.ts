import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Request, Get} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {LocalAuthGuard} from "./guards/local.guard";
import {JwtAuthGuard} from "./guards/jwt.guard";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
