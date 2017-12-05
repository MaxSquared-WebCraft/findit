import { Service, Token } from "typedi";
import { IDataSource } from "./Application";
import { createConnection } from "typeorm";

export const MongoDataSourceImpl = new Token<IDataSource>();

@Service(MongoDataSourceImpl)
export class MongoImpl implements IDataSource {

  async setup() {
    createConnection()
  };
}