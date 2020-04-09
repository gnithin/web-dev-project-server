import * as passport from 'passport';
import { Request } from 'express';
import authConstants from '../../constants/auth';
import UserAuth from '../../models/UserAuth';

export class AuthenticationStrategy extends passport.Strategy {
    name = authConstants.LOCAL;

    authenticate(req: Request, options?: any): any {
        // TODO: Actual data
        let dummyUser: UserAuth = {
            id: 123,
            email: 'dummy-email',
            name: 'dummy',
            isAdmin: true,
        };

        this.success(dummyUser);
    }
}
