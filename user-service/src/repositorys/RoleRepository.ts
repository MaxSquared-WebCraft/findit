import {Service} from 'typedi';
import {Repository, EntityRepository} from 'typeorm';
import {RoleModel} from '../models/RoleModel';

@Service()
@EntityRepository(RoleModel)
export class RoleRepository extends Repository<RoleModel> {

}

export {RoleModel};
