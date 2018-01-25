import * as jwt from 'jsonwebtoken';
import {UserModel} from '../models/UserModel';
import {MethodNotAllowedError} from 'routing-controllers';

const JWT_SECRET: string = process.env.JWT_SECRET;

export function assertIsAdmin(token: string) {
    const payload = getPayload(token);
    if (payload.role !== 'ADMIN') {
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
        const decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new MethodNotAllowedError('You are not logged in!');
    }
}

export function getPayload(token: string): Token {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new MethodNotAllowedError('You are not logged in!');
    }
}

export function createToken(user: UserModel): string {
    const payload: Token = {
        uuid: user.uuid,
        role: user.role.name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}
