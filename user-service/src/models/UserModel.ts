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

    @Column()
    providerId: string;

    @Column()
    provider: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    profilePictureUrl: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    editedDate: Date;

    @ManyToOne(type => RoleModel, role => role.id)
    role: RoleModel;

    @Column()
    deleted: boolean = false;

    @Column()
    apiKey: string;

    constructor(data?:any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = data.password;
        this.profilePictureUrl = data.profilePictureUrl;
        this.createdDate = data.createdDate;
        this.editedDate = data.editedDate;
        this.role = data.role;
        this.deleted = data.deleted ? data.deleted : false;
        this.apiKey = data.apiKey;
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
