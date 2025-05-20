import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from 'src/DTO/signup-user.dto';
import { LoginUserDto } from 'src/DTO/login-user.dto';
import { UpdateUserDto } from 'src/DTO/update-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() signUpDto: SignupUserDto) {
        const user = await this.authService.register(signUpDto);

        // Return the user object without the password
        return user;
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const result = await this.authService.loginUser(email, password);

        if (!result) {
            return { message: 'Invalid credentials' };
        }

        return {
            message: 'Login successful',
            accessToken: result.accessToken,
            user: result.user,
        };
        // Return the access token and user object
    }

}