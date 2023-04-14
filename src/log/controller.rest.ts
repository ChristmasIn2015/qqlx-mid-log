import { Controller, Get, Post, Body, Patch, SetMetadata, UseGuards } from "@nestjs/common";

import { PATH_LOG } from "qqlx-core";
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
    ) {}

    @Post("/get")
    async getLog(@Body("dto") dto: getLogDto, @Body("UserDTO") UserDTO: UserDTO): Promise<getLogRes> {
        trimObject(dto.search);
        const search = dto.search;

        // 搜索
        const match = {
            ...(search.type && { chain: search.type }),
            ...(search.chain && { chain: new RegExp(search.chain) }),
            ...(search.path && { path: new RegExp(search.path) }),
            ...(search.json && { json: new RegExp(search.json) }),
        };

        const page = await this.LogDao.page(match, dto.page);
        return page;
    }
}