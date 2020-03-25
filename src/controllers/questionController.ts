import { AnswerService } from './../services/answerService';
import { Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { Question } from '../entities/question';
import { Answer } from '../entities/answer';
import { ResponseHandler } from '../common/ResponseHandler';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import ERROR_CODES from '../constants/errorCodes';

@Controller('api/questions')
export class QuestionController {
    private service: QuestionService;
    private answerService: AnswerService;

    constructor() {
        this.service = QuestionService.getInstance();
        this.answerService = AnswerService.getInstance();
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
        try{
            await validateOrReject(question)
        }catch(e){
            ResponseHandler.sendErrorJson(
                resp,
                e,
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

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
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

        const question: Question = plainToClass(Question, req.body as Question);
        try{
            await validateOrReject(question)
        }catch(e) {
            ResponseHandler.sendErrorJson(
                resp,
                e,
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

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

    @Post(':qid/answers')
    private async createAnswerForQuestion(req: Request, resp: Response) {
        const qid: number = parseInt(req.params.qid, 10);
        if (isNaN(qid)) {
            ResponseHandler.sendErrorJson(
                resp,
                'Invalid question id',
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

        const reqAnswer: Answer = plainToClass(Answer, req.body as Answer);
        try{
            await validateOrReject(reqAnswer)
        }catch(e) {
            ResponseHandler.sendErrorJson(
                resp,
                e,
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }

        try {
            const answer: Answer = await this.answerService.createAnswerForQuestion(reqAnswer, qid);
            ResponseHandler.sendSuccessJson(resp, answer);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

}
