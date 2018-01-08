import 'reflect-metadata'
import { Application } from "./config/Application";
import { Container } from "typedi";
import { useContainer } from "routing-controllers";
import { createConnection, useContainer as useContainerORM } from 'typeorm'

useContainer(Container);
useContainerORM(Container);

const startApplication = async () => {
  await createConnection();
  return Container.get(Application).start()
};

startApplication()
  .then(() => console.log('App started successfully.'))
  .catch(console.error);

