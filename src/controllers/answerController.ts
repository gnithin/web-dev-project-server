import { Controller, Delete, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { ResponseHandler } from '../common/ResponseHandler';
import { Answer } from '../entities/answer';
import { AnswerService } from '../services/answerService';
import { Question } from '../entities/question';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import ERROR_CODES from '../constants/errorCodes';
import UserAuth from '../models/UserAuth';
import { UserAuthMiddleware } from '../common/auth/authMiddleware';

@Controller('api/answers')
export class AnswerController {
    private service: AnswerService;

    constructor() {
        this.service = AnswerService.getInstance();
    }

    @Put(':aid')
    @Middleware(UserAuthMiddleware)
    private async updateAnswer(req: Request, resp: Response) {
        const aid: number = parseInt(req.params.aid, 10);
        if (isNaN(aid)) {
            ResponseHandler.sendErrorJson(
                resp,
                'Invalid answer id',
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

        const reqAnswer: Answer = plainToClass(Answer, req.body as Answer);
        try{
            await validateOrReject(reqAnswer)
        } catch(e) {
            ResponseHandler.sendErrorJson(
                resp,
                e,
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

        try {
            let user: UserAuth = (req.user as UserAuth);
            const answer: Answer = await this.service.updateAnswerForId(aid, reqAnswer, user);
            ResponseHandler.sendSuccessJson(resp, answer);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Delete(':aid')
    @Middleware(UserAuthMiddleware)
    private async deleteAnswer(req: Request, resp: Response) {
        try {
            const aid: number = parseInt(req.params.aid, 10);
            if (isNaN(aid)) {
                throw Error('Invalid answer id');
            }

            let user:UserAuth = (req.user as UserAuth);
            await this.service.deleteAnswerForId(aid, user);
            ResponseHandler.sendSuccessJson(resp, null);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
}
