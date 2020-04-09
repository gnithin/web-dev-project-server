import { Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { AdminUserAuthMiddleware, UserAuthMiddleware } from '../common/auth/authMiddleware';
import * as passport from 'passport';
import authConstants from '../constants/auth';


@Controller('api/users')
export class UserController {
    @Get('login')
    @Middleware(
        passport.authenticate(
            authConstants.LOCAL,
            {
                session: true,
            }
        )
    )
    private loginUser(req: Request, resp: Response) {
        // TODO: Detect if there is actually a user available already
        if (req.isAuthenticated()) {
            return resp.status(200).json({data: req.user});
        }
        return resp.status(401).json({message: 'couldn\'t login'});
    }

    @Get('logout')
    private logoutUser(req: Request, resp: Response) {
        if (!req.isAuthenticated()) {
            return resp.status(400).json({message: 'couldn\'t logout'});
        }

        req.logOut();
        return resp.status(200).json({message: 'success!'});
    }

    @Get('register')
    private registerUser(req: Request, resp: Response) {
        // TODO:
        return resp.status(200).json({todo: 'todo'});
    }

    @Get('details/:user')
    @Middleware(UserAuthMiddleware)
    private getUserDetails(req: Request, resp: Response) {
        // TODO:
        return resp.status(200).json({details: 'all-the user details'});
    }

    @Get('all')
    @Middleware(AdminUserAuthMiddleware)
    private getAllUsers(req: Request, resp: Response) {
        return resp.status(200).json({'status': 'success!'})
    }
}
