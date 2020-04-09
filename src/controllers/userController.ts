import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AdminUserAuthMiddleware, UserAuthMiddleware } from '../common/auth/authMiddleware';
import authConstants from '../constants/auth';
import { ResponseHandler } from '../common/ResponseHandler';
import ERROR_CODES from '../constants/errorCodes';
import { UserService } from '../services/userService';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { UserRequest } from '../models/UserRequest';
import { User } from '../entities/user';
import { UserResponse } from '../models/UserResponse';
import { UserLoginRequest } from '../models/userLoginRequest';
import UserAuth from '../models/UserAuth';

const bcrypt = require('bcrypt');

@Controller('api/users')
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = UserService.getInstance();
    }

    @Post('login')
    // @Middleware(
    //     [
    //         passport.authenticate(authConstants.LOCAL, {session: true}),
    //         UserAuthMiddleware,
    //     ]
    // )
    private async loginUser(req: Request, resp: Response) {
        let loginReq = plainToClass(UserLoginRequest, req.body);

        // Validate the request body
        let validationErr = await validate(loginReq);
        if (validationErr != null && validationErr.length > 0) {
            ResponseHandler.sendErrorJson(resp, validationErr as any, ERROR_CODES.REQUEST_VALIDATION_ERR, 400);
            return;
        }

        let userAuth: UserAuth;
        try {
            userAuth = await this.authenticateUser(loginReq);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message, ERROR_CODES.CREDENTIALS_INVALID, 401);
            return;
        }

        req.login(userAuth, (err) => {
            if (err) {
                console.log('Errr - ', err);
                ResponseHandler.sendErrorJson(resp, err, ERROR_CODES.INTERNAL_ERR, 500);
                return;
            }

            let userResp: UserResponse = plainToClass(UserResponse, classToPlain(userAuth));
            return ResponseHandler.sendSuccessJson(resp, userResp);
        });
    }

    private async authenticateUser(loginReq: UserLoginRequest): Promise<UserAuth> {
        let user: User;
        try {
            user = await this.userService.findUserForEmail(loginReq.email);
        } catch (e) {
            throw new Error('Username and/or passwords do not match!');
        }

        let didPasswordMatch = await bcrypt.compare(loginReq.password, user.passwordHash);
        if (!didPasswordMatch) {
            throw new Error('Username and/or passwords do not match!');
        }

        return plainToClass(UserAuth, user as UserAuth);
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
        let userReq: UserRequest = plainToClass(UserRequest, (req.body as UserRequest));

        try {
            await validateOrReject(userReq);
        } catch (e) {
            ResponseHandler.sendErrorJson(
                resp, e,
                ERROR_CODES.REQUEST_VALIDATION_ERR, 400
            );
            return;
        }

        try {
            let user: User = await this.createUserForRequest(userReq);
            let createdUser = await this.userService.registerUser(user);

            let userResp: UserResponse = plainToClass(
                UserResponse,
                classToPlain(createdUser),
            );
            console.log('User resp - ', userResp);
            ResponseHandler.sendSuccessJson(resp, userResp);

        } catch (e) {
            ResponseHandler.sendErrorJson(
                resp, e,
                ERROR_CODES.INTERNAL_ERR, 400
            );
            return;
        }
    }

    private async createUserForRequest(userReq: UserRequest): Promise<User> {
        let user = plainToClass(User, (userReq as any as User));

        // Create password hash
        user.passwordHash = await bcrypt.hash(userReq.password, authConstants.SALT_ROUNDS);

        return user;
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
