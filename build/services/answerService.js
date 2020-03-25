"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const answerRepository_1 = require("../repositories/answerRepository");
const typeorm_1 = require("typeorm");
const questionService_1 = require("./questionService");
class AnswerService {
    constructor() {
        this.answerRepository = typeorm_1.getConnection().getCustomRepository(answerRepository_1.AnswerRepository);
        this.questionService = questionService_1.QuestionService.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AnswerService();
        }
        return this.instance;
    }
    async createAnswerForQuestion(answer, qid) {
        answer.question = await this.questionService.getQuestionById(qid, false);
        return await this.answerRepository.save(answer);
    }
    async updateAnswerForId(aid, updatedAnswer) {
        await this.answerRepository.findOneOrFail(aid);
        updatedAnswer.id = aid;
        return await this.answerRepository.save(updatedAnswer);
    }
    async deleteAnswerForId(aid) {
        await this.answerRepository.delete(aid);
    }
}
exports.AnswerService = AnswerService;
