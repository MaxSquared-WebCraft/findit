import {UserRepository} from '../repositorys/UserRepository';
import {Strategy as GoogleStrategy} from 'passport-google-oauth';
import {Strategy as LocalAPIKeyStrategy} from 'passport-localapikey';
import {Strategy as LocalStrategy} from 'passport-localapikey';
import {Strategy as JwtStrategy} from 'passport-jwt';
import {BadRequestError} from 'routing-controllers';
import {Container} from 'typedi';
import {UserModel} from '../models/UserModel';
import {Profile} from 'passport';
import * as config from 'config';
import * as passport from 'passport';
import * as bcrypt  from 'bcrypt';
import {ExtractJwt} from 'passport-jwt';

let userRepositority: UserRepository;

let opts = {
    jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
    secretOrKey: config.get('auth.jwt_secret').toString()
};

async function localHandler(email: string, password: string, done: Function) {
    if(!userRepositority) {
        userRepositority = Container.get(UserRepository);
    }
    let user = await userRepositority.findOne({email});

    bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if(err) throw new BadRequestError("Can't compare passwords");
        return isPasswordMatch ? done(null, user) : done(null, false);
    });
}

async function apiKeyHandler(apiKey: string, done: Function) {
    if(!userRepositority) {
        userRepositority = Container.get(UserRepository);
    }
    let user = await userRepositority.findOne({apiKey});
    user ? done(null, user) : done(null, false);
}

async function googleHandler(accessToken:string, refreshToken:string, profile: Profile, done: Function) {
    if(!userRepositority) {
        userRepositority = Container.get(UserRepository);
    }
    let user = await userRepositority.findOne({providerId: profile.id});

    // User doesn't exist so we create a new user
    if(!user) {
        user = await userRepositority.registerUser(UserModel.parseOAuth(profile));
    }
    user ? done(null, user) : done(null, false);
}

async function jwtHandler(payload, done) {
    if(payload && payload.id && payload.role) {
        done(null, payload);
    } else {
        done(null, false);
    }
}

export function setupAuth(app) {
    app.use(passport.initialize());
    passport.use(new LocalStrategy({usernameField: "email", session: false}, localHandler));
    passport.use(new LocalAPIKeyStrategy(apiKeyHandler));
    passport.use(new GoogleStrategy(config.get("auth.google"), googleHandler));
    passport.use(new JwtStrategy(opts, jwtHandler));
}
