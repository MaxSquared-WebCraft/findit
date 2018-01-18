import 'reflect-metadata'
import { Application } from "./config/Application";
import { Container } from "typedi";
import { useContainer } from "routing-controllers";
import { createConnection, useContainer as useContainerORM } from 'typeorm'
import * as config from 'config'
import { Document } from "./entities/Document";
import { User } from "./entities/User";

useContainer(Container);
useContainerORM(Container);

const typeOrmConfig: any = JSON.parse(JSON.stringify(config.get('typeOrm')));

typeOrmConfig.entities = [
  Document,
  User,
];

const startApplication = async () => {
  await createConnection(typeOrmConfig);
  return Container.get(Application).start()
};

startApplication()
  .then(() => console.log('App started successfully.'))
  .catch(console.error);

