import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    async createUser(user: User): Promise<{ message: string; user: User }> {
        const newUser = this.userRepository.create(user);
        const savedUser = await this.userRepository.save(newUser);
        return {
            message: 'User created successfully',
            user: savedUser,
        }
    }

    findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOneUser(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    updateUser(id: number, user: User): Promise<User> {
        return this.userRepository.save({ ...user, id });
    }

    async deleteUser(id: number): Promise<void> {
        return this.userRepository.delete(id).then(() => { });
    }


}