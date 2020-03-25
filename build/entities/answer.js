"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const question_1 = require("./question");
const user_1 = require("./user");
const class_validator_1 = require("class-validator");
let Answer = class Answer {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], Answer.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    typeorm_1.Column({ type: 'longtext' }),
    tslib_1.__metadata("design:type", String)
], Answer.prototype, "answer", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => question_1.Question, question => question.answers, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", question_1.Question)
], Answer.prototype, "question", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => user_1.User, user => user.answers),
    tslib_1.__metadata("design:type", user_1.User)
], Answer.prototype, "user", void 0);
Answer = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'answers' })
], Answer);
exports.Answer = Answer;
