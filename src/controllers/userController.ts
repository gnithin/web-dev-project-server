import { Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AdminUserAuthMiddleware, UserAuthMiddleware } from '../common/auth/authMiddleware';
import * as passport from 'passport';
import authConstants from '../constants/auth';
import { ResponseHandler } from '../common/ResponseHandler';
import ERROR_CODES from '../constants/errorCodes';


@Controller('api/users')
export class UserController {
    @Get('login')
    @Middleware(
        [
            passport.authenticate(authConstants.LOCAL, {session: true}),
            UserAuthMiddleware,
        ]
    )
    private loginUser(req: Request, resp: Response) {
        return ResponseHandler.sendSuccessJson(resp, null);
    }

    @Get('logout')
    private logoutUser(req: Request, resp: Response) {
        if (!req.isAuthenticated()) {
            ResponseHandler.sendErrorJson(resp, 'Invalid operation', ERROR_CODES.BAD_REQUEST, 400)
            return;
        }

        req.logOut();
        return ResponseHandler.sendSuccessJson(resp, null);
    }

    @Get('register')
    private registerUser(req: Request, resp: Response) {
        // TODO:
        return ResponseHandler.sendSuccessJson(resp, {todo: 'todo'});
    }

    @Get('details/:user')
    @Middleware(UserAuthMiddleware)
    private getUserDetails(req: Request, resp: Response) {
        // TODO:
        return ResponseHandler.sendSuccessJson(resp, {todo: 'user-details'});
    }

    @Get('all')
    @Middleware(AdminUserAuthMiddleware)
    private getAllUsers(req: Request, resp: Response) {
        return ResponseHandler.sendSuccessJson(resp, {todo: 'all-user-details'});
    }
}
