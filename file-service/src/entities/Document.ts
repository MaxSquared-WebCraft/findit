import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@Entity()
export class Document {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  userId: string;
}