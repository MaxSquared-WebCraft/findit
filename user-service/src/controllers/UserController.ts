import {Authorized, Body, Controller, CurrentUser, Delete, ForbiddenError, Get, Param, Put} from 'routing-controllers';
import {UserRepository} from '../repositorys/UserRepository';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {UserModel} from '../models/UserModel';
import {KafkaHandler} from '../kafka/Kafka';

@Controller('/users')
@Authorized()
export class UserController {
    constructor(@OrmRepository() private readonly userRepository: UserRepository,
                private readonly kafka: KafkaHandler) {}

    @Get('/')
    @Authorized('ADMIN')
    async getAll(): Promise<UserModel[]> {
        return await this.userRepository.find({deleted: false});
    }

    @Get('/:id')
    async getById(@Param('uuid') uuid: string,
                  @CurrentUser() currentUser: Token): Promise<UserModel> {
        if(currentUser.role !== 'ADMIN' || currentUser.uuid !== uuid) {
            throw new ForbiddenError();
        }

        return this.userRepository.findOne({uuid, deleted: false});
    }

    @Put('/')
    async update(@Body({ required: true }) user: UserModel,
                 @CurrentUser() currentUser: Token): Promise<UserModel> {
        if(currentUser.role !== 'ADMIN' || currentUser.uuid !== user.uuid) {
            throw new ForbiddenError();
        }
        this.kafka.sendEvent('USER_CHANGED', user);
        return Promise.resolve(user);
    }

    @Delete('/:uuid')
    async delete(@Param('uuid') uuid: string,
                 @CurrentUser() currentUser: Token): Promise<boolean> {
        if(currentUser.role !== 'ADMIN' || currentUser.uuid !== uuid) {
            throw new ForbiddenError();
        }
        let user = await this.userRepository.findOne({uuid});
        if(user) {
            this.kafka.sendEvent('USER_DELETED', uuid);
        }
        return Promise.resolve(!!user);
    }
}
