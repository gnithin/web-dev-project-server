import { Request, Response } from 'express';
import UserAuth from '../../models/UserAuth';

export const UserAuthMiddleware = (req: Request, resp: Response, next: any) => {
    if (!req.isAuthenticated()) {
        resp.status(401).json({message: 'Unauthorized access!'});
        return;
    }
    next();
};

export const AdminUserAuthMiddleware = (req: Request, resp: Response, next: any) => {
    if (!req.isAuthenticated()) {
        resp.status(401).json({message: 'Unauthorized access!'});
        return;
    }

    let user = req.user as UserAuth;
    if (!user.isAdmin) {
        resp.status(401).json({message: 'Unauthorized access!'});
        return;
    }
    next();
};

