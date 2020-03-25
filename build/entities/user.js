"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const question_1 = require("./question");
const answer_1 = require("./answer");
let User = class User {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "name", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(type => question_1.Question, question => question.user),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "questions", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(type => answer_1.Answer, answer => answer.user),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "answers", void 0);
User = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'users' })
], User);
exports.User = User;
