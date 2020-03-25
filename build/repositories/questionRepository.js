"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const question_1 = require("../entities/question");
let QuestionRepository = class QuestionRepository extends typeorm_1.Repository {
};
QuestionRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(question_1.Question)
], QuestionRepository);
exports.QuestionRepository = QuestionRepository;
