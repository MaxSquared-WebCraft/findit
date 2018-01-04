import {
    Column,
    CreateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {RoleModel} from './RoleModel';
import {Profile} from 'passport';
import {Entity} from 'typeorm/decorator/entity/Entity';

@Entity()
export class UserModel {

    @PrimaryGeneratedColumn('uuid')
    id: string;

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
            this.id = data.id ? data.id : "";
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

    static parseOAuth(data:Profile): UserModel {
        let user = new UserModel();
        user.provider = data.provider;
        user.providerId = data.id;
        user.firstName = data.name.givenName;
        user.lastName = data.name.familyName;

        if(data.emails.length > 0) {
            user.email = data.emails[0].value;
        }
        if(data.photos.length > 0) {
            user.profilePictureUrl = data.photos[0].value;
        }

        return user;
    }
}
