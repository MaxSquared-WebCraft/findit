import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import {UserModel} from '../models/UserModel';
import {MethodNotAllowedError} from 'routing-controllers';

export function assertIsAdmin(token: string) {
    const payload = getPayload(token);
    if (payload.role != 'ADMIN') {
        throw new MethodNotAllowedError('You have insufficient permissions!');
    }
}

export function assertIsPaidUser(token: string) {
    const payload = getPayload(token);
    if (!payload.role.includes('PAID')) {
        throw new MethodNotAllowedError('You have insufficient permissions!');
    }
}

export function assertIsLoggedIn(token: string) {
    try {
        const decoded = jwt.verify(token, config.get('auth.jwt_secret'));
    } catch (err) {
        throw new MethodNotAllowedError('You are not logged in!');
    }
}

export function getPayload(token: string): Token {
    try {
        return jwt.verify(token, config.get('auth.jwt_secret'));
    } catch (err) {
        throw new MethodNotAllowedError('You are not logged in!');
    }
}

export function createToken(user: UserModel): string {
    let payload: Token = {
        id: user.id,
        role: user.role.name
    };
    return jwt.sign(payload, config.get('auth.jwt_secret'));
}
