import {Connection} from 'typeorm';
import {RoleModel} from '../models/RoleModel';
import {UserModel} from '../models/UserModel';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid/v4';

export async function setUpDatabase(connection: Connection) {
    const roleRepo = connection.getRepository(RoleModel);
    const userRepo = connection.getRepository(UserModel);

    let adminRole = await roleRepo.findOne({name: 'ADMIN'});
    if(!adminRole) {
        adminRole = new RoleModel();
        adminRole.name = 'ADMIN';
        adminRole.isDefault = false;
        adminRole = await roleRepo.save(adminRole);
    }

    let freeRole = await roleRepo.findOne({name: 'FREE'});
    if(!freeRole) {
        freeRole = new RoleModel();
        freeRole.name = 'FREE';
        freeRole.isDefault = true;
        await roleRepo.save(freeRole);
    }

    let admin = await userRepo.findOne({email: 'admin@findit.at'});
    if(!admin) {
        admin = new UserModel();
        admin.uuid = uuid();
        admin.email = 'admin@findit.at';
        const salt = bcrypt.genSaltSync(10);
        admin.password = bcrypt.hashSync('FindIt#Admin!', salt);
        admin.role = adminRole;
        await userRepo.save(admin);
    }

}
