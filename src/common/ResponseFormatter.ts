export class ResponseFormatter {
    public static jsonSuccess(data: any) {
        return {
            status: 1,
            message: 'success',
            data,
        };
    }

    public static jsonError(message: string, code?: number) {
        return {
            status: 0,
            message,
            code,
        }
    }
}