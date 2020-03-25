"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@overnightjs/core");
const ResponseHandler_1 = require("../common/ResponseHandler");
const answer_1 = require("../entities/answer");
const answerService_1 = require("../services/answerService");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const errorCodes_1 = require("../constants/errorCodes");
let AnswerController = class AnswerController {
    constructor() {
        this.service = answerService_1.AnswerService.getInstance();
    }
    async updateAnswer(req, resp) {
        const aid = parseInt(req.params.aid, 10);
        if (isNaN(aid)) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, 'Invalid answer id', errorCodes_1.default.REQUEST_VALIDATION_ERR, 400);
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
            const answer = await this.service.updateAnswerForId(aid, reqAnswer);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, answer);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
    async deleteAnswer(req, resp) {
        try {
            const aid = parseInt(req.params.aid, 10);
            if (isNaN(aid)) {
                throw Error('Invalid answer id');
            }
            await this.service.deleteAnswerForId(aid);
            ResponseHandler_1.ResponseHandler.sendSuccessJson(resp, null);
        }
        catch (e) {
            ResponseHandler_1.ResponseHandler.sendErrorJson(resp, e.message);
        }
    }
};
tslib_1.__decorate([
    core_1.Put(':aid'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AnswerController.prototype, "updateAnswer", null);
tslib_1.__decorate([
    core_1.Delete(':aid'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AnswerController.prototype, "deleteAnswer", null);
AnswerController = tslib_1.__decorate([
    core_1.Controller('api/answers'),
    tslib_1.__metadata("design:paramtypes", [])
], AnswerController);
exports.AnswerController = AnswerController;
