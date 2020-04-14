import { UserService } from './../services/userService';
import { User } from './../entities/user';
import { AnswerService } from './../services/answerService';
import { Controller, Delete, Get, Middleware, Post, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { Question } from '../entities/question';
import { Answer } from '../entities/answer';
import { ResponseHandler } from '../common/ResponseHandler';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import ERROR_CODES from '../constants/errorCodes';
import { UserAuthMiddleware } from '../common/auth/authMiddleware';
import UserAuth from '../models/UserAuth';

@Controller('api/questions')
export class QuestionController {
    private service: QuestionService;
    private answerService: AnswerService;
    private userService: UserService;

    constructor() {
        this.service = QuestionService.getInstance();
        this.answerService = AnswerService.getInstance();
        this.userService = UserService.getInstance();
    }

    @Get()
    private async getAllQuestions(req: Request, resp: Response) {
        try {
            let user: UserAuth = req.user as UserAuth;
            const questions: Question[] = await this.service.getAllQuestions(
                user?.id,
                req.query.limit,
                req.query.offset,
            );
            ResponseHandler.sendSuccessJson(resp, questions);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Get(':questionId')
    private async getQuestionById(req: Request, resp: Response) {
        const userAuth: UserAuth = req.user as UserAuth;
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }
            const question: Question = await this.service.getQuestionById(qId, true, userAuth?.id);
            ResponseHandler.sendSuccessJson(resp, question);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Post()
    @Middleware(UserAuthMiddleware)
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
            let user: UserAuth = req.user as UserAuth;
            const newQuestion = await this.service.createNewQuestion(question, user);
            ResponseHandler.sendSuccessJson(resp, newQuestion);
        } catch (e) {
            console.error(e);
            ResponseHandler.sendErrorJson(resp, e);
        }
    }

    @Put(':questionId')
    @Middleware(UserAuthMiddleware)
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
            let user: UserAuth = req.user as UserAuth;
            const updatedQuestion = await this.service.updateQuestion(qId, req.body as Question, user);
            ResponseHandler.sendSuccessJson(resp, updatedQuestion);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Delete(':questionId')
    @Middleware(UserAuthMiddleware)
    private async deleteQuestion(req: Request, resp: Response) {
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }


            let user: UserAuth = req.user as UserAuth;
            const serviceResponse = await this.service
                .deleteQuestion(qId, user);
            ResponseHandler.sendSuccessJson(resp, { affected: serviceResponse });
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Get(':qid/answers')
    private async getAnswersForQuestion(req: Request, resp: Response) {
        const qid: number = parseInt(req.params.qid, 10);
        const userAuth: UserAuth = req.user as UserAuth;
        if (isNaN(qid)) {
            ResponseHandler.sendErrorJson(
                resp,
                'Invalid question id',
                ERROR_CODES.REQUEST_VALIDATION_ERR,
                400
            );
            return;
        }
        try {
            const answers = await this.service.getAnswersForQuestion(
                qid,
                userAuth?.id,
                req.query.limit,
                req.query.offset,
            );
            ResponseHandler.sendSuccessJson(resp, answers);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Post(':qid/answers')
    @Middleware(UserAuthMiddleware)
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
            let user: UserAuth = req.user as UserAuth;
            const answer: Answer = await this.answerService.createAnswerForQuestion(reqAnswer, qid, user);
            ResponseHandler.sendSuccessJson(resp, answer);

        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Put(':qId/upvote')
    @Middleware(UserAuthMiddleware)
    private async upvoteAnswer(req: Request, resp: Response) {
        const userAuth: UserAuth = req.user as UserAuth;
        const user: User = await this.userService.findUserForId(userAuth.id);
        try {
            const qId: number = parseInt(req.params.qId, 10);
            if (isNaN(qId)) {
                throw Error('Invalid question id');
            }
            await this.service.addReputationToQuestion(qId, 1, user);
            ResponseHandler.sendSuccessJson(resp, null);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Put(':qId/downvote')
    @Middleware(UserAuthMiddleware)
    private async downvoteAnswer(req: Request, resp: Response) {
        const userAuth: UserAuth = req.user as UserAuth;
        const user: User = await this.userService.findUserForId(userAuth.id);
        try {
            const qId: number = parseInt(req.params.qId, 10);
            if (isNaN(qId)) {
                throw Error('Invalid question id');
            }
            await this.service.addReputationToQuestion(qId, -1, user);
            ResponseHandler.sendSuccessJson(resp, null);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }

    @Delete(':qId/votes')
    @Middleware(UserAuthMiddleware)
    private async deleteVote(req: Request, resp: Response) {
        const userAuth: UserAuth = req.user as UserAuth;
        try {
            const qId: number = parseInt(req.params.qId, 10);
            if (isNaN(qId)) {
                throw Error('Invalid question id');
            }
            await this.service.deleteReputationVote(qId, userAuth.id);
            ResponseHandler.sendSuccessJson(resp, null);
        } catch (e) {
            ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
}
