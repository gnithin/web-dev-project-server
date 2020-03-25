"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const answer_1 = require("../entities/answer");
let AnswerRepository = class AnswerRepository extends typeorm_1.Repository {
};
AnswerRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(answer_1.Answer)
], AnswerRepository);
exports.AnswerRepository = AnswerRepository;
