import {Controller, Get} from '@overnightjs/core';
import {Request, Response} from 'express';
import {QuestionService} from '../services/questionService';
import {Question} from '../entities/question';

@Controller('api/questions')
export class QuestionController {
    service: QuestionService;

    constructor() {
        this.service = new QuestionService();
    }

    @Get('all')
    private async getAllQuestions(req: Request, resp: Response) {
        const questions: Question[] = await this.service.getAllQuestions();
        resp.status(200).json({questions});
    }
}