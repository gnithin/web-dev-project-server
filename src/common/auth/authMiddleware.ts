import { Request, Response } from 'express';
import UserAuth from '../../models/UserAuth';
import { ResponseHandler } from '../ResponseHandler';
import ERROR_CODES from '../../constants/errorCodes';

export const UserAuthMiddleware = (req: Request, resp: Response, next: any) => {
    if (!req.isAuthenticated()) {
        ResponseHandler.sendErrorJson(
            resp,
            'Unauthorized access!',
            ERROR_CODES.UNAUTHORIZED_ACCESS,
            401
        );
        return;
    }
    next();
};

export const AdminUserAuthMiddleware = (req: Request, resp: Response, next: any) => {
    if (!req.isAuthenticated() || !(req.user as UserAuth).isAdmin) {
        ResponseHandler.sendErrorJson(
            resp,
            'Unauthorized access!',
            ERROR_CODES.UNAUTHORIZED_ACCESS,
            401
        );
        return;
    }
    next();
};

