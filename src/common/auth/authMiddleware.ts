import { Request, Response } from 'express';
import * as passport from 'passport';
import authConstants from '../../constants/auth';

let UserAuthMiddleware = (req: Request, resp: Response, next: any) => {
    return passport.authenticate(
        authConstants.LOCAL,
        middlewareHandler(req, resp, next),
    )(req, resp, next);
};

// TODO: have a user-middleware-handler and an admin-middleware handler

let middlewareHandler = (req: Request, resp: Response, next: any) => {
    return (err: any, user: any, challenges: string, status: number) => {
        if (!status) {
            status = 401;
        }

        if (!user) {
            resp.status(status).json({message: challenges});
            return;
        }

        // Pass the user details into the user locals
        resp.locals.user = user;
        next();
    }
};

export default UserAuthMiddleware;
