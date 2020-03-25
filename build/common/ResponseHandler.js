"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseFormatter_1 = require("./ResponseFormatter");
class ResponseHandler {
    static sendSuccessJson(resp, data) {
        resp.status(200).json(ResponseFormatter_1.ResponseFormatter.jsonSuccess(data));
    }
    static sendErrorJson(resp, message, errCode, httpCode) {
        if (!httpCode) {
            httpCode = 500;
        }
        resp.status(httpCode).json(ResponseFormatter_1.ResponseFormatter.jsonError(message, errCode));
    }
}
exports.ResponseHandler = ResponseHandler;
