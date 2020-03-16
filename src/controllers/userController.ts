import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('api/users')
export class UserController {
    @Get('all')
    private getAllUsers(req: Request, resp: Response) {
        return resp.status(200).json({'status': 'success!'})
    }
}