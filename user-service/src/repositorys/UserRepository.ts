import {Service} from 'typedi';
import {Repository, EntityRepository} from 'typeorm';
import {UserModel} from '../models/UserModel';
import {RoleModel} from '../models/RoleModel';

@Service()
@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {

    async registerUser(user: UserModel): Promise<UserModel> {
        if(!user.role) {
            user.role = await this.manager.findOne(RoleModel, {name: 'FREE'});
        }
        return this.save(user);
    }
}
