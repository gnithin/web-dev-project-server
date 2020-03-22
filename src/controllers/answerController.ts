import { Controller, Delete, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { ResponseHandler } from '../common/ResponseHandler';
import { Answer } from '../entities/answer';
import { AnswerService } from '../services/answerService';

@Controller('api/answers')
export class AnswerController {
    private service: AnswerService;

    constructor() {
        this.service = AnswerService.getInstance();
    }

    @Post('question/:qid')
    private async createAnswerForQuestion(req: Request, resp: Response) {
        try {
            let qid: number = parseInt(req.params.qid);
            if (isNaN(qid)) {
                throw Error('Invalid question id');
            }

            const reqAnswer: Answer = (req.body as Answer);

            const answer: Answer = await this.service.createAnswerForQuestion(reqAnswer, qid);
            ResponseHandler.sendSuccessJson(resp, answer);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Put(':aid')
    private async updateAnswer(req: Request, resp: Response) {
        try {
            let aid: number = parseInt(req.params.aid);
            if (isNaN(aid)) {
                throw Error('Invalid answer id');
            }

            const reqAnswer: Answer = (req.body as Answer);
            const answer: Answer = await this.service.updateAnswerForId(aid, reqAnswer)
            ResponseHandler.sendSuccessJson(resp, answer);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Delete(':aid')
    private async deleteAnswer(req: Request, resp: Response) {
        try {
            let aid: number = parseInt(req.params.aid);
            if (isNaN(aid)) {
                throw Error('Invalid answer id');
            }

            await this.service.deleteAnswerForId(aid);
            ResponseHandler.sendSuccessJson(resp, null);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
}
