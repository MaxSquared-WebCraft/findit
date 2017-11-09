import {Entity, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {UserModel} from './UserModel';

@Entity()
export class RoleModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    isDefault: boolean;

    @OneToMany((type) => UserModel, (user) => user.role)
    users: UserModel[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    editedDate: Date;
}