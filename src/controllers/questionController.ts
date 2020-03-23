import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { Question } from '../entities/question';
import { ResponseHandler } from '../common/ResponseHandler';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

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
            const question: Question = await this.service.getQuestionById(qId);
            ResponseHandler.sendSuccessJson(resp, question);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Post()
    private async createNewQuestion(req: Request, resp: Response) {
        const question: Question = plainToClass(Question, req.body as Question);
        await validateOrReject(question).catch(errors => {
            ResponseHandler.sendErrorJson(resp, errors, 400, 400);
        });

        try {
            const newQuestion = await this.service.createNewQuestion(question);
            ResponseHandler.sendSuccessJson(resp, newQuestion);
        } catch (e) {
            console.error(e);
            ResponseHandler.sendErrorJson(resp, e);
        }
    }

    @Put(':questionId')
    private async updateQuestion(req: Request, resp: Response) {
        const qId = parseInt(req.params.questionId, 10);
        if (isNaN(qId)) {
            ResponseHandler.sendErrorJson(resp,
                'Invalid question ID. Expecting a number.',
                400,
                400
            );
            return;
        }

        const question: Question = plainToClass(Question, req.body as Question);
        await validateOrReject(question).catch(errors => {
            ResponseHandler.sendErrorJson(resp, errors, 400, 400);
        });

        try {
            const updatedQuestion = await this.service.updateQuestion(qId, req.body as Question);
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
