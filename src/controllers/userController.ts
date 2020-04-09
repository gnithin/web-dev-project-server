import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AdminUserAuthMiddleware, UserAuthMiddleware } from '../common/auth/authMiddleware';
import * as passport from 'passport';
import authConstants from '../constants/auth';
import { ResponseHandler } from '../common/ResponseHandler';
import ERROR_CODES from '../constants/errorCodes';
import { UserService } from '../services/userService';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UserRequest } from '../models/UserRequest';


@Controller('api/users')
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = UserService.getInstance();
    }

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

    @Post('register')
    private async registerUser(req: Request, resp: Response) {
        let user: UserRequest = plainToClass(UserRequest, (req.body as UserRequest));

        try {
            await validateOrReject(user);
        } catch (e) {
            ResponseHandler.sendErrorJson(
                resp, e,
                ERROR_CODES.REQUEST_VALIDATION_ERR, 400
            );
            return;
        }

        let userResp = await this.userService.registerUser(user);
        ResponseHandler.sendSuccessJson(resp, userResp);
    }

    @Get('details/:user')
    @Middleware(UserAuthMiddleware)
    private getUserDetails(req: Request, resp: Response) {
        return ResponseHandler.sendSuccessJson(resp, {todo: 'todo'});
    }

    @Get('all')
    @Middleware(AdminUserAuthMiddleware)
    private getAllUsers(req: Request, resp: Response) {
        return ResponseHandler.sendSuccessJson(resp, {todo: 'all-user-details'});
    }
}
