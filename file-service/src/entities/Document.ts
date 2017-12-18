import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Document {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @OneToMany(() => User, user => user.id)
  users: User[];
}