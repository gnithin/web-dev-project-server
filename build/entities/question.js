"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const answer_1 = require("./answer");
const user_1 = require("./user");
const class_validator_1 = require("class-validator");
let Question = class Question {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], Question.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    typeorm_1.Column({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "title", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    typeorm_1.Column({
        type: 'longtext'
    }),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "description", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(type => answer_1.Answer, answer => answer.question),
    tslib_1.__metadata("design:type", Array)
], Question.prototype, "answers", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => user_1.User, user => user.questions),
    tslib_1.__metadata("design:type", user_1.User)
], Question.prototype, "user", void 0);
Question = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'questions' })
], Question);
exports.Question = Question;
