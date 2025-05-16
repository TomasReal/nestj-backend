import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupUserDto } from 'src/DTO/signup-user.dto';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export interface RegisterResponse {
    user: User;
    message: string;
    savedUser: User;
}


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

}
