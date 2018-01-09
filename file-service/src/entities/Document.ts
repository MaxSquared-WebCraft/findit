import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity()
export class Document {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  location: string;

  @ManyToMany(() => User, user => user.documents, {
    cascadeInsert: true,
    cascadeUpdate: true,
  })
  @JoinTable()
  users: User[];
}