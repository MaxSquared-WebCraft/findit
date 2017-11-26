import {Service} from 'typedi';
import {Connection, createConnection} from 'typeorm';
import {RoleModel} from '../models/RoleModel';
import {UserModel} from '../models/UserModel';

@Service()
export class MySql {
    private _db: Connection;

    async db() {
        if (!this.db) {
            this._db = await createConnection({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'admin',
                database: 'test',
                entities: [
                    RoleModel,
                    UserModel
                ],
                synchronize: true,
                logging: false
            });
        }
        return this._db;
    }

    async health() {
        // something like this:
        // https://github.com/dannydavidson/k8s-neo-api/blob/master/annotely-graph/apps/ops/health.js
        return true;
    }

}
