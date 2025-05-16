import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // @Post()
    // createUser(@Body() body: Partial<User>) {
    //     const user: User = { ...body } as User;
    //     return this.usersService.createUser(user);
    // }

    @Get()
    findAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    findOneUser(@Param() params: { id: number }) {
        return this.usersService.findOneUser(params.id);
    }

    @Put(':id')
    updateUser(@Param() params: { id: number }, @Body() body: Partial<User>) {
        const user: User = { ...body } as User;
        return this.usersService.updateUser(params.id, user);
    }

    @Delete(':id')
    deleteUser(@Param() params: { id: number }) {
        return this.usersService.deleteUser(params.id);
    }
}
