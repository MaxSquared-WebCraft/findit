import {
    Column,
    CreateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {RoleModel} from './RoleModel';
import {Entity} from 'typeorm/decorator/entity/Entity';

@Entity()
export class UserModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    uuid: string;

    @Column({nullable: true})
    providerId: string;

    @Column({nullable: true})
    provider: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    profilePictureUrl: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    editedDate: Date;

    @ManyToOne(type => RoleModel, role => role.users, { eager: true })
    role: RoleModel;

    @Column()
    deleted: boolean = false;

    @Column({nullable: true})
    apiKey: string;

    constructor(data?:any) {
        if (data) {
            this.id = data.id ? data.id : null;
            this.uuid = data.uuid ? data.uuid : "";
            this.firstName = data.firstName ? data.firstName : null;
            this.lastName = data.lastName ? data.lastName : null;
            this.email = data.email ? data.email : null;
            this.password = data.password ? data.password : null;
            this.profilePictureUrl = data.profilePictureUrl ? data.profilePictureUrl : null;
            this.createdDate = data.createdDate ? data.createdDate : null;
            this.editedDate = data.editedDate ? data.editedDate : null;
            this.role = data.role ? data.role : null;
            this.deleted = data.deleted ? data.deleted : false;
            this.apiKey = data.apiKey ? data.apiKey : null;
        }
    }
}
