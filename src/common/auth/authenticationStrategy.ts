import * as passport from 'passport';
import { Request } from 'express';
import authConstants from '../../constants/auth';

export class AuthenticationStrategy extends passport.Strategy {
    name = authConstants.LOCAL;

    authenticate(req: Request, options?: any): any {
        console.log('Req - ', req.query['a']);

        // TODO: Check if the user exists in the session!
        if (req.query['a'] === '1') {
            this.success({userId: '1'})
        } else {
            this.fail('Invalid access!');
        }
    }
}
