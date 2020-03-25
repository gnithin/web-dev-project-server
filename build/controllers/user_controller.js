"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@overnightjs/core");
let UserController = class UserController {
    getAllUsers(req, resp) {
        return resp.status(200).json({ 'status': 'success!' });
    }
};
tslib_1.__decorate([
    core_1.Get('all'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserController.prototype, "getAllUsers", null);
UserController = tslib_1.__decorate([
    core_1.Controller('api/users')
], UserController);
exports.UserController = UserController;
