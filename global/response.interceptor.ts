import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { map } from "rxjs/operators";

import { Response } from "qqlx-cdk";

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((data) => {
                const response: Response<T> = {
                    code: 200,
                    data: data ?? null,
                    message: "成功",
                };
                return response;
            })
        );
    }
}
