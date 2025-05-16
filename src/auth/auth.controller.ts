import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from 'src/DTO/signup-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() signUpDto: SignupUserDto) {
        const user = await this.authService.register(signUpDto);

        // Return the user object without the password
        return user;
    }
}