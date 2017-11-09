import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./Document";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @ManyToMany(() => Document, document => document.users, {
    cascadeUpdate: true,
    cascadeInsert: true,
  })
  documents: Document[]
}