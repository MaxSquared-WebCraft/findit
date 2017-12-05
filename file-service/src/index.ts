import 'reflect-metadata'
import { Application } from "./config/Application";
import { Container } from "typedi";
import { useContainer } from "routing-controllers";
import { useContainer as useContainerORM } from 'typeorm'

useContainer(Container);
useContainerORM(Container);

const application = Container.get(Application);

application.start();