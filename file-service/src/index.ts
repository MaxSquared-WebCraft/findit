import 'reflect-metadata'
import { Application } from "./config/Application";
import { Container } from "typedi";
import { useContainer } from "routing-controllers";
import { createConnection, useContainer as useContainerORM } from 'typeorm'
import { Document } from "./entities/Document";
import { User } from "./entities/User";

useContainer(Container);
useContainerORM(Container);

const typeOrmConfig: any = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "database": process.env.DB_NAME,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "synchronize": true,
    "logging": false
};

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

