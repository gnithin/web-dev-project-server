import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('api/users')
export class UserController {
    @Post('authenticate')
    private authenticateUser(req: Request, resp: Response) {
        // TODO:
        return resp.status(200).json({todo: 'todo'});
    }

    @Get('details/:user')
    private getUserDetails(req: Request, resp: Response) {
        // TODO:
        return resp.status(200).json({todo: 'todo'});
    }

    @Get('register')
    private registerUser(req: Request, resp: Response) {
        // TODO:
        return resp.status(200).json({todo: 'todo'});
    }

    @Get('all')
    private getAllUsers(req: Request, resp: Response) {
        return resp.status(200).json({'status': 'success!'})
    }
}
