import {Authorized, Body, Controller, CurrentUser, Delete, ForbiddenError, Get, Param, Put} from 'routing-controllers';
import {UserModel, UserRepository} from '../repositorys/UserRepository';
import {OrmRepository} from 'typeorm-typedi-extensions';

@Controller('/users')
@Authorized()
export class UserController {
    constructor(@OrmRepository() private readonly userRepository: UserRepository) {}

    @Get('/')
    @Authorized('ADMIN')
    async getAll(): Promise<UserModel[]> {
        return await this.userRepository.find({deleted: false});
    }

    @Get('/:id')
    async getById(@Param('id') id: string,
                  @CurrentUser() currentUser: Token): Promise<UserModel> {
        if(currentUser.role !== 'ADMIN' || currentUser.id !== id) {
            throw new ForbiddenError();
        }

        return this.userRepository.findOne({id, deleted: false});
    }

    @Put('/')
    async update(@Body({ required: true }) user: UserModel,
                 @CurrentUser() currentUser: Token): Promise<UserModel> {
        if(currentUser.role !== 'ADMIN' || currentUser.id !== user.id) {
            throw new ForbiddenError();
        }
        return this.userRepository.save(user);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string,
                 @CurrentUser() currentUser: Token): Promise<UserModel> {
        if(currentUser.role !== 'ADMIN' || currentUser.id !== id) {
            throw new ForbiddenError();
        }
        let user = await this.userRepository.findOne({id});
        user.deleted = true;
        return this.userRepository.save(user);
    }
}
