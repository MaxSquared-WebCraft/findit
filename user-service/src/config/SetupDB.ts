
import {Connection} from 'typeorm';
import {RoleModel} from '../models/RoleModel';
import {UserModel} from '../models/UserModel';

export async function setUpDatabase(connection: Connection) {
    const roleRepo = connection.getRepository(RoleModel);
    const userRepo = connection.getRepository(UserModel);

    let adminRole = await roleRepo.findOne({name: "ADMIN"});
    if(!adminRole) {
        adminRole = new RoleModel();
        adminRole.name = "ADMIN";
        adminRole.isDefault = false;
        adminRole = await roleRepo.save(adminRole);
    }

    let freeRole = await roleRepo.findOne({name: "FREE"});
    if(!freeRole) {
        freeRole = new RoleModel();
        freeRole.name = "FREE";
        freeRole.isDefault = true;
        freeRole = await roleRepo.save(freeRole);
    }

    let admin = await userRepo.findOne({email: "admin@findit.at"});
    if(admin) {
        admin = new UserModel();
        admin.email = "admin@findit.at";
        admin.password = "FindIt#Admin!";
        admin.role = adminRole;
        admin = await userRepo.save(admin);
    }

}
