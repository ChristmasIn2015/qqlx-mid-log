import { Controller, Get, Post, Body, Patch, SetMetadata, UseGuards } from "@nestjs/common";

import { ENUM_LOG, PATH_LOG, MAP_ENUM_LOG } from "qqlx-core";
import { getLogDto, getLogRes } from "qqlx-core";
import { UserDTO } from "qqlx-sdk";

import { UserGuard } from "global/user.guard";
import { LogDao } from "dao/log";
import { trimObject } from "qqlx-cdk";

@Controller(PATH_LOG)
@UseGuards(UserGuard)
export class LogController {
    constructor(
        //
        private readonly LogDao: LogDao
    ) {
        this.deleteLogs();
    }

    /** 仅保留5天内的日志 */
    private async deleteLogs() {
        let count = 0;
        setInterval(async () => {
            const endTime = Date.now() - 86400000 * 5;
            const logs = await this.LogDao.query({ timeCreate: { $lte: endTime } });
            const counter = await this.LogDao.count({}, { startTime: 0, endTime });
            await this.LogDao.deleteMany(logs.map((e) => e._id));
            console.log(++count, "delete success", counter);
        }, 1000 * 60 * 120);
    }

    @Post("/get")
    async getLog(@Body("dto") dto: getLogDto, @Body("UserDTO") UserDTO: UserDTO): Promise<getLogRes> {
        trimObject(dto.search);
        const search = dto.search;

        // 搜索
        const match = {
            ...([...MAP_ENUM_LOG].map((e) => e[1]?.value).includes(search.type) && { type: search.type }),
            ...(search.chain && { chain: new RegExp(search.chain) }),
            ...(search.path && { path: new RegExp(search.path) }),
            ...(search.json && { json: new RegExp(search.json) }),
        };

        const page = await this.LogDao.page(match, dto.page);
        return page;
    }
}
