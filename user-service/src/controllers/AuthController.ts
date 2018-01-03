import {Body, Controller, NotFoundError, Post, Req, UseBefore} from 'routing-controllers';
import {UserRepository} from '../repositorys/UserRepository';
import {AlreadyExistsError} from '../errors/AlreadyExistsError';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {createToken} from '../util/RoleHelper';
import {SignupUser} from '../dtos/SignupUser';
import {KafkaHandler} from '../kafka/Kafka';
import * as passport from 'passport';

@Controller()
export class AuthController {

    constructor(@OrmRepository() private readonly userRepository: UserRepository,
                private readonly kafka: KafkaHandler) {
    }

    @Post('/signup')
    async signUp(@Body({ required: true }) registerUser: SignupUser): Promise<any> {
        if (await this.userRepository.findOne({email: registerUser.email})) {
            throw new AlreadyExistsError("Email is already in use.")
        }
        this.kafka.sendEvent('USER_CREATED', registerUser);
        return Promise.resolve({success: true});
    }

    @Post('/login')
    @UseBefore(passport.authenticate('local'))
    async login(@Req() request: any): Promise<any> {
        if(!request.user) {
            throw new NotFoundError("Unknown user/password combination.")
        }
        return Promise.resolve({token: createToken(request.user)});
    }

    @Post('/authenticate')
    @UseBefore(passport.authenticate('localapikey'))
    async authenticate(@Req() request: any): Promise<any> {
        if(!request.user) {
            throw new NotFoundError("Unknown user/password combination.")
        }
        return Promise.resolve({token: createToken(request.user)});
    }

    @Post('/oauth')
    @UseBefore(passport.authenticate('google'))
    async oauth(@Req() request: any): Promise<any> {
        if(!request.user) {
            throw new NotFoundError("Unknown user/password combination.")
        }
        return Promise.resolve({token: createToken(request.user)});
    }
}
