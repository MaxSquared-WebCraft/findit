import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./Document";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, document => document.users)
  document: Document
}