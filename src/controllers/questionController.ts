import {Controller, Get, Post} from '@overnightjs/core';
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

    @Post('new')
    private async createNewQuestion(req: Request, resp: Response) {
        try {
            const newQuestion = await this.service.createNewQuestion((req.body as Question));
            resp.status(200).json(newQuestion)
        } catch (e) {
            resp.status(500).json({})
        }
    }
}