import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
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
import { UserDetailsResponse } from '../models/userDetailsResponse';
import { UserPublicDetailsResponse } from '../models/userPublicDetailsResponse';
import EditUserRequest from '../models/editUserRequest';

const bcrypt = require('bcrypt');

@Controller('api/users')
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = UserService.getInstance();
    }

    @Post('login')
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

        // Check if the email exists
        try {
            await this.userService.findUserForEmail(userReq.email);

            ResponseHandler.sendErrorJson(
                resp,
                'User with email exists!',
                ERROR_CODES.GENERAL,
                400
            );
            return;
        } catch (e) {
            // If user not found, then all good.
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

    @Get('current')
    @Middleware(UserAuthMiddleware)
    private getCurrentLoggedInUser(req: Request, resp: Response) {
        return ResponseHandler.sendSuccessJson(resp, plainToClass(UserAuth, req.user as UserAuth));
    }

    @Get('details')
    @Middleware(UserAuthMiddleware)
    private async getUserDetails(req: Request, resp: Response) {
        let userAuth: UserAuth = req.user as UserAuth;
        let user: User = await this.userService.findUserDetailsForId(userAuth.id);
        let userDetails: UserDetailsResponse = plainToClass(UserDetailsResponse, user as UserDetailsResponse);
        return ResponseHandler.sendSuccessJson(resp, userDetails);
    }

    @Get('details/:uid')
    private async getUserPublicDetails(req: Request, resp: Response) {
        let userIdStr = req.params.uid;
        if (isNaN(parseInt(userIdStr))) {
            ResponseHandler.sendErrorJson(resp, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        let userId = parseInt(userIdStr);
        try {
            let user = await this.userService.findUserDetailsForId(userId);
            let userAuth: UserAuth = req.user as UserAuth;
            let userResponse;
            if (userAuth && userAuth.id === userId) {
                userResponse = plainToClass(UserDetailsResponse, user as UserDetailsResponse);
            } else {
                userResponse = plainToClass(UserPublicDetailsResponse, user as UserPublicDetailsResponse)
            }

            ResponseHandler.sendSuccessJson(resp, userResponse);
            return;

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }
    }

    @Get(':userId/reputation')
    private async getUserReputation(req: Request, res: Response) {
        let userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            ResponseHandler.sendErrorJson(res, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }
        try {
            const questionReputation = await this.userService.getReputation(userId);
            ResponseHandler.sendSuccessJson(res, questionReputation);
        } catch (e) {
            ResponseHandler.sendErrorJson(res, e.message);
        }
    }

    @Get('all')
    @Middleware(AdminUserAuthMiddleware)
    private async getAllUsers(req: Request, resp: Response) {
        try {
            const users = await this.userService.getAllUsers();
            ResponseHandler.sendSuccessJson(resp, users);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Put('set/admin/:userId')
    @Middleware(AdminUserAuthMiddleware)
    private async setAdmin(req: Request, res: Response) {
        let userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            ResponseHandler.sendErrorJson(res, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        try {
            const questionReputation = await this.userService.setAdmin(userId);
            ResponseHandler.sendSuccessJson(res, questionReputation);
        } catch (e) {
            ResponseHandler.sendErrorJson(res, e.message);
        }
    }

    @Put('unset/admin/:userId')
    @Middleware(AdminUserAuthMiddleware)
    private async unsetAdmin(req: Request, res: Response) {
        let userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            ResponseHandler.sendErrorJson(res, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        try {
            const questionReputation = await this.userService.unsetAdmin(userId);
            ResponseHandler.sendSuccessJson(res, questionReputation);
        } catch (e) {
            ResponseHandler.sendErrorJson(res, e.message);
        }
    }

    @Delete(':userId')
    @Middleware(AdminUserAuthMiddleware)
    private async deleteUser(req: Request, res: Response) {
        let userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            ResponseHandler.sendErrorJson(res, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        try {
            await this.userService.deleteUser(userId);
            ResponseHandler.sendSuccessJson(res, {});
        } catch (e) {
            ResponseHandler.sendErrorJson(res, e.message);
        }
    }

    @Put('edit/:userId')
    @Middleware(UserAuthMiddleware)
    private async editUser(req: Request, res: Response) {
        let userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            ResponseHandler.sendErrorJson(res, 'Invalid request', ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        // Make sure that the user being edited is the same user as the one logged-in (or admin)
        let loggedInUser = (req.user as UserAuth);
        if (!loggedInUser.isAdmin && loggedInUser.id !== userId) {
            ResponseHandler.sendErrorJson(res, 'user cannot be modified', ERROR_CODES.UNAUTHORIZED_ACCESS, 401);
            return;
        }

        let editRequest = plainToClass(EditUserRequest, req.body);
        let validateErr = await validate(editRequest);
        if (validateErr && validateErr.length !== 0) {
            ResponseHandler.sendErrorJson(res, JSON.stringify(validateErr), ERROR_CODES.BAD_REQUEST, 400);
            return;
        }

        // Perform the edit operation from the edit user
        try{
            let newUser:User = await this.userService.editUser(userId, editRequest);
            let userAuth = plainToClass(UserAuth, newUser);

            // Perform re-login, since the user entries in req.user would've changed
            req.login(userAuth, (err) => {
                if (err) {
                    console.log('Errr - ', err);
                    ResponseHandler.sendErrorJson(res, err, ERROR_CODES.INTERNAL_ERR, 500);
                    return;
                }
                return ResponseHandler.sendSuccessJson(res, userAuth);
            });

        } catch(e) {

            ResponseHandler.sendErrorJson(res, JSON.stringify(validateErr));
            return ;
        }
    }
}
