import {Service} from 'typedi';
import {Repository, EntityRepository} from 'typeorm';
import {UserModel} from '../models/UserModel';
import {RoleRepository} from './RoleRepository';
import {OrmRepository} from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt';
import {BadRequestError} from 'routing-controllers';

@Service()
@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {

    constructor(@OrmRepository() private readonly roleRepository: RoleRepository) {
        super()
    }

    async registerUser(user:UserModel): Promise<UserModel> {
        if(!user.role) {
            user.role = await this.roleRepository.findOne({isDefault: true});
        }
        return bcrypt.hash(user.password, 10, (err, hash) => {
            if (err)
                throw new BadRequestError("Couldn't create Salt");
            user.password = hash;
            return this.save(user);
        });
    }
}

export {UserModel};
