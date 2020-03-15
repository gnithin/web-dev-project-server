import {Controller, Get, Post} from '@overnightjs/core';
import {Request, Response} from 'express';
import {QuestionService} from '../services/questionService';
import {Question} from '../entities/question';
import {ResponseHandler} from '../common/ResponseHandler';

@Controller('api/questions')
export class QuestionController {
    service: QuestionService;

    constructor() {
        this.service = new QuestionService();
    }

    @Get('all')
    private async getAllQuestions(req: Request, resp: Response) {
        try {
            const questions: Question[] = await this.service.getAllQuestions();
            ResponseHandler.sendSuccessJson(resp, questions);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Post('new')
    private async createNewQuestion(req: Request, resp: Response) {
        try {
            const newQuestion = await this.service.createNewQuestion((req.body as Question));
            ResponseHandler.sendSuccessJson(resp, newQuestion);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
}