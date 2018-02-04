'use strict';

import 'ts-helpers';
import 'source-map-support/register';
import 'reflect-metadata';
import './types';

import { Application } from './config/Application';
import { Container } from "typedi";

Container.get(Application);
