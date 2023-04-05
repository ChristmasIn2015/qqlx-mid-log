import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";

import { Log } from "qqlx-core";
import { HOST_MID_LOG, PORT_MID_LOG, postLogDto, ToResponse } from "qqlx-sdk";

import { LogDao } from "dao/log";

@Controller()
export class LogRpc {
    constructor(
        //
        private readonly LogDao: LogDao
    ) {}

    @EventPattern("postLog") // 需要客户端 emit 没有返回值
    @ToResponse()
    async postLog(dto: postLogDto) {
        this.LogDao.create(dto.schema);
    }
}
