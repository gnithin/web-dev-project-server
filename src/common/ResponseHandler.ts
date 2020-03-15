import {Response} from 'express';
import {ResponseFormatter} from './ResponseFormatter';

export class ResponseHandler {
    public static sendSuccessJson(resp: Response, data: any) {
        resp.status(200).json(ResponseFormatter.jsonSuccess(data));
    }

    public static sendErrorJson(
        resp: Response,
        message: string,
        errCode?: number,
        httpCode?: number,
    ) {
        if (!httpCode) {
            httpCode = 500;
        }
        resp.status(httpCode).json(ResponseFormatter.jsonError(message, errCode))
    }
}