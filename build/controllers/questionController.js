"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const answerService_1 = require("./../services/answerService");
const core_1 = require("@overnightjs/core");
const questionService_1 = require("../services/questionService");
const question_1 = require("../entities/question");
const answer_1 = require("../entities/answer");
const ResponseHandler_1 = require("../common/ResponseHandler");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const errorCodes_1 = require("../constants/errorCodes");
let QuestionController = class QuestionController {
    constructor() {
        this.service = questionService_1.QuestionService.getInstance();
        this.answerService = answerService_1.AnswerService.getInstance();
    }
    async getAllQuestions(req, resp) {
        try {
            const questions = await this.service.getAllQuestions();
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, questions);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
    async getQuestionById(req, resp) {
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }
            const question = await this.service.getQuestionById(qId);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, question);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
    async createNewQuestion(req, resp) {
        const question = class_transformer_1.plainToClass(question_1.Question, req.body);
        try {
            await class_validator_1.validateOrReject(question);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e, errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
            return;
        }
        try {
            const newQuestion = await this.service.createNewQuestion(question);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, newQuestion);
        }
        catch (e) {
            console.error(e);
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e);
        }
    }
    async updateQuestion(req, resp) {
        const qId = parseInt(req.params.questionId, 10);
        if (isNaN(qId)) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, 'Invalid question ID. Expecting a number.', errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
            return;
        }
        const question = class_transformer_1.plainToClass(question_1.Question, req.body);
        try {
            await class_validator_1.validateOrReject(question);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e, errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
            return;
        }
        try {
            const updatedQuestion = await this.service.updateQuestion(qId, req.body);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, updatedQuestion);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
    async deleteQuestion(req, resp) {
        try {
            const qId = parseInt(req.params.questionId, 10);
            if (isNaN(qId)) {
                throw new Error('Invalid question ID. Expecting a number.');
            }
            const serviceResponse = await this.service
                .deleteQuestion(qId);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, { affected: serviceResponse });
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
    async createAnswerForQuestion(req, resp) {
        const qid = parseInt(req.params.qid, 10);
        if (isNaN(qid)) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, 'Invalid question id', errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
            return;
        }
        const reqAnswer = class_transformer_1.plainToClass(answer_1.Answer, req.body);
        try {
            await class_validator_1.validateOrReject(reqAnswer);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e, errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
            return;
        }
        try {
            const answer = await this.answerService.createAnswerForQuestion(reqAnswer, qid);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, answer);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
};
tslib_1.__decorate([
    core_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "getAllQuestions", null);
tslib_1.__decorate([
    core_1.Get(':questionId'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "getQuestionById", null);
tslib_1.__decorate([
    core_1.Post(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "createNewQuestion", null);
tslib_1.__decorate([
    core_1.Put(':questionId'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "updateQuestion", null);
tslib_1.__decorate([
    core_1.Delete(':questionId'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "deleteQuestion", null);
tslib_1.__decorate([
    core_1.Post(':qid/answers'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], QuestionController.prototype, "createAnswerForQuestion", null);
QuestionController = tslib_1.__decorate([
    core_1.Controller('api/questions'),
    tslib_1.__metadata("design:paramtypes", [])
], QuestionController);
exports.QuestionController = QuestionController;
