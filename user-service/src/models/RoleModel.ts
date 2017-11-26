import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Entity} from 'typeorm/decorator/entity/Entity';

@Entity()
export class RoleModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    isDefault: boolean;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    editedDate: Date;
}