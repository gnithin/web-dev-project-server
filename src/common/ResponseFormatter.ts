import ERROR_CODES from '../constants/errorCodes';

export class ResponseFormatter {
    public static jsonSuccess(data: any) {
        return {
            status: 1,
            message: 'success',
            data,
        };
    }

    public static jsonError(message: string, code?: number) {
        if (!code) {
            code = ERROR_CODES.GENERAL;
        }

        return {
            status: 0,
            message,
            code,
        }
    }
}
