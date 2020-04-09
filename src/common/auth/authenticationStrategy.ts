import * as passport from 'passport';
import { Request } from 'express';
import authConstants from '../../constants/auth';
import { plainToClass } from 'class-transformer';
import { UserLoginRequest } from '../../models/userLoginRequest';

export class AuthenticationStrategy extends passport.Strategy {
    name = authConstants.LOCAL;

    authenticate(req: Request, options?: any): any {
        let userReq: UserLoginRequest = plainToClass(UserLoginRequest, req.body);

        // this.success();
    }
}
