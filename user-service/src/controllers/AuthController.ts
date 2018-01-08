import {BadRequestError, Body, Controller, Post} from 'routing-controllers';
import {AlreadyExistsError} from '../errors/AlreadyExistsError';
import {UserRepository} from '../repositorys/UserRepository';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {UserModel} from '../models/UserModel';
import {createToken} from '../util/RoleHelper';
import {SignupUser} from '../dtos/SignupUser';
import {KafkaHandler} from '../kafka/Kafka';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid/v4';

@Controller()
export class AuthController {
    constructor(@OrmRepository()
                private readonly userRepository: UserRepository,
                private readonly kafka: KafkaHandler) {
    }

    @Post('/signup')
    async signUp(@Body({ required: true }) registerUser: SignupUser): Promise<any> {
        if (await this.userRepository.findOne({email: registerUser.email})) {
            throw new AlreadyExistsError('Email is already in use.');
        }
        const salt = bcrypt.genSaltSync(10);
        registerUser.password = bcrypt.hashSync(registerUser.password, salt);
        const userObj: any = registerUser;
        userObj.uuid = uuid();
        this.kafka.sendEvent('USER_CREATED', userObj);
        return Promise.resolve({success: true});
    }

    @Post('/login')
    async login(@Body({ required: true }) loginUser: SignupUser): Promise<any> {
        const user: UserModel = await this.userRepository.findOne({email: loginUser.email});
        if (!user && bcrypt.compareSync(loginUser.password, user.password)) {
            throw new Error('Ungültige User/Passwort kombination.');
        }
        return Promise.resolve({token: createToken(user)});
    }
}
