"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorCodes_1 = require("../constants/errorCodes");
class ResponseFormatter {
    static jsonSuccess(data) {
        return {
            status: 1,
            message: 'success',
            data,
        };
    }
    static jsonError(message, code) {
        if (!code) {
            code = errorCodes_1.default.GENERAL;
        }
        return {
            status: 0,
            message,
            code,
        };
    }
}
exports.ResponseFormatter = ResponseFormatter;
