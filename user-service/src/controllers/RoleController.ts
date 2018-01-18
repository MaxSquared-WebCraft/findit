import {OrmRepository} from 'typeorm-typedi-extensions';
import {Authorized, Body, Controller, Delete, Get, Param, Post, Put} from 'routing-controllers';
import {RoleRepository} from '../repositorys/RoleRepository';
import {RoleModel} from '../models/RoleModel';

@Controller('/roles')
@Authorized('ADMIN')
export class RoleController {
    constructor(@OrmRepository() private readonly roleRepository: RoleRepository) {}

    @Get('/')
    async getAll(): Promise<RoleModel[]> {
        return this.roleRepository.find();
    }

    @Get('/:uuid')
    async getById(@Param('id') id: string): Promise<RoleModel> {
        return this.roleRepository.findOne({id});
    }

    @Post('/')
    async add(@Body({required: true}) user: RoleModel): Promise<RoleModel> {
        return this.roleRepository.save(user);
    }

    @Put('/')
    async update(@Body({ required: true }) user: RoleModel): Promise<RoleModel> {
        return this.roleRepository.save(user);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.roleRepository.deleteById(id);
    }
}
