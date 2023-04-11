import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

import { Response as RestResponse } from "qqlx-cdk";
import { ENUM_LOG, MAP_ENUM_ERROR_CODE } from "qqlx-core";
import { UserDTO } from "qqlx-sdk";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor() {}

    catch(exception, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const UserDTO: UserDTO = request.body.UserDTO;
        const response = context.getResponse<Response>();

        // 业务错误
        const isErrorCode = typeof exception === "number";
        if (isErrorCode) {
            const rest: RestResponse<null> = {
                code: exception,
                data: null,
                message: MAP_ENUM_ERROR_CODE.get(exception)?.text || `未知错误：${exception}`,
            };
            response.json(rest);
        }
        // 其他错误
        else {
            const rest: RestResponse<null> = {
                code: null,
                data: null,
                message: typeof exception === "string" ? exception : exception?.message,
            };
            response.json(rest);
        }
    }
}
