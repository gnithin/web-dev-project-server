import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { Question } from '../entities/question';
import { ResponseHandler } from '../common/ResponseHandler';

@Controller('api/questions')
export class QuestionController {
    private service: QuestionService;

    constructor() {
        this.service = QuestionService.getInstance();
    }

    @Get()
    private async getAllQuestions(req: Request, resp: Response) {
        try {
            const questions: Question[] = await this.service.getAllQuestions();
            ResponseHandler.sendSuccessJson(resp, questions);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Get(':questionId')
    private async getQuestionById(req: Request, resp: Response) {
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }
            const question = await this.service
                .getQuestionById(qId);
            ResponseHandler.sendSuccessJson(resp, question);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Post()
    private async createNewQuestion(req: Request, resp: Response) {
        try {
            const newQuestion = await this.service.createNewQuestion((req.body as Question));
            ResponseHandler.sendSuccessJson(resp, newQuestion);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Put()
    private async updateQuestion(req: Request, resp: Response) {
        try {
            const updatedQuestion = await this.service.updateQuestion(req.body as Question);
            ResponseHandler.sendSuccessJson(resp, updatedQuestion);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Delete(':questionId')
    private async deleteQuestion(req: Request, resp: Response) {
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }
            const serviceResponse = await this.service
                .deleteQuestion(qId);
            ResponseHandler.sendSuccessJson(resp, { affected: serviceResponse });
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

}
