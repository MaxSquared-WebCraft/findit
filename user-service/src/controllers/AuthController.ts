import {BadRequestError, Body, Controller, Post} from 'routing-controllers';
import {AlreadyExistsError} from '../errors/AlreadyExistsError';
import {UserRepository} from '../repositorys/UserRepository';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {UserModel} from '../models/UserModel';
import {createToken} from '../util/RoleHelper';
import {SignupUser} from '../dtos/SignupUser';
import {KafkaHandler} from '../kafka/Kafka';
import * as bcrypt  from 'bcrypt';

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
        registerUser.password = bcrypt.hashSync(registerUser.password, 10);
        this.kafka.sendEvent('USER_CREATED', registerUser);
        return Promise.resolve({success: true});
    }

    @Post('/login')
    async login(@Body({ required: true }) loginUser: SignupUser): Promise<any> {
        let user:UserModel = await this.userRepository.findOne({email: loginUser.email});
        if (!user && bcrypt.compare(loginUser.password, user.password, (err, isPasswordMatch) => {
                if (err) throw new BadRequestError("Can't compare passwords");
                return isPasswordMatch;
            })) {
            throw new Error("Ungültige User/Passwort kombination.")
        }
        return Promise.resolve({token: createToken(user)});
    }
}
