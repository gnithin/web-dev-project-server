import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { ResponseHandler } from '../common/ResponseHandler';
import { Question } from '../entities/question';
import { QuestionService } from '../services/questionService';

@Controller('api/questions')
export class QuestionController {
    service: QuestionService;

    constructor() {
        this.service = new QuestionService();
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
            let question = await this.service.getQuestionById(parseInt(req.params.questionId));
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
            const serviceResponse = await this.service.deleteQuestion(parseInt(req.params.questionId));
            ResponseHandler.sendSuccessJson(resp, serviceResponse);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

}