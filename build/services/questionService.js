"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const questionRepository_1 = require("../repositories/questionRepository");
class QuestionService {
    constructor() {
        this.questionRepository = typeorm_1.getConnection().getCustomRepository(questionRepository_1.QuestionRepository);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new QuestionService();
        }
        return this.instance;
    }
    async getAllQuestions() {
        try {
            return await this.questionRepository.find({
                relations: ['user']
            });
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    }
    async getQuestionById(qId, includeAnswers = true) {
        let relations = ['user'];
        if (includeAnswers) {
            relations.push('answers');
        }
        try {
            return await this.questionRepository.findOneOrFail(qId, {
                relations: relations
            });
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    }
    async createNewQuestion(question) {
        console.log('Question - ', question);
        try {
            return await this.questionRepository.save(question);
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    }
    async updateQuestion(qId, question) {
        console.log('Updating - ', qId);
        try {
            if (await this.questionRepository.findOne(qId) === undefined) {
                throw new Error('Entity does not exist');
            }
            question.id = qId;
            return await this.questionRepository.save(question);
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    }
    async deleteQuestion(questionId) {
        console.log('Deleting - ', questionId);
        try {
            const res = await this.questionRepository.delete(questionId);
            return Number(res.affected);
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    }
}
exports.QuestionService = QuestionService;
