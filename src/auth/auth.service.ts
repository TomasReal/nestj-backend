import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from 'src/DTO/signup-user.dto';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export interface RegisterResponse {
    user: User;
    message: string;
    savedUser: User;
}

export interface LoginResponse {
    user: User;
    message: string;
    accessToken: string;
}


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(signupUserDto: SignupUserDto): Promise<RegisterResponse> {
        const { name, email, password } = signupUserDto;

        // Check if the user already exists

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        // Note: The save method will automatically handle the insertion of the new user
        // and return the saved user object.
        const savedUser = await this.userRepository.save(newUser);
        delete savedUser.password; // Remove the password from the returned user object
        return {
            user: savedUser,
            message: 'User registered successfully',
            savedUser: savedUser
        }; // Spread savedUser properties and add message
    }

    async loginUser(email: string, password: string): Promise<LoginResponse> {
        // Find the user by email
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null; // Invalid password
        }

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);



        delete user.password; // Remove the password from the returned user object
        return {
            user,
            accessToken,
            message: 'Welcome, user logued successfully'
        }// Return the user object without the password
    }

}
