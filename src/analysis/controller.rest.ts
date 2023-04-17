import { Controller, Get, Post, Body, Patch, SetMetadata, Delete, UseGuards } from "@nestjs/common";

import { ENUM_LOG, LogAnalysisJoined, PATH_LOG_ANALYSIS } from "qqlx-core";
import { getLogAnalysisDto, getLogAnalysisRes, postLogAnalysisDto, postLogAnalysisRes, deleteAccessDto, deleteAccessRes } from "qqlx-core";
import { UserDTO } from "qqlx-sdk";

import { UserGuard } from "global/user.guard";
import { LogDao } from "dao/log";
import { LogAnalysisDao } from "dao/analysis";

@Controller(PATH_LOG_ANALYSIS)
@UseGuards(UserGuard)
export class LogAnalysisController {
    constructor(
        //
        private readonly LogDao: LogDao,
        private readonly LogAnalysisDao: LogAnalysisDao
    ) {}

    @Post()
    async postLogAnalysis(@Body("dto") dto: postLogAnalysisDto): Promise<postLogAnalysisRes> {
        if (!dto.title) throw new Error("请输入标题");
        if (!dto.path) throw new Error("请输入路径");

        await this.LogAnalysisDao.create(dto);
        return null;
    }

    @Post("/get")
    @UseGuards(UserGuard)
    async getLogAnalysis(@Body("dto") dto: getLogAnalysisDto, @Body("UserDTO") UserDTO: UserDTO): Promise<getLogAnalysisRes> {
        const analysis = await this.LogAnalysisDao.query({});

        const list: LogAnalysisJoined[] = [];
        const options = { startTime: dto.page.startTime, endTime: dto.page.endTime };
        for (const ana of analysis) {
            const count0 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.OFF }, options);
            const count1 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.FATAL }, options);
            const count2 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.ERROR }, options);
            const count3 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.WARN }, options);
            const count4 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.INFO }, options);
            const count5 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.DEBUG }, options);
            const count6 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.TRACE }, options);
            const count7 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.ALL }, options);
            const joined: LogAnalysisJoined = {
                ...ana,
                classes: [
                    { type: ENUM_LOG.OFF, count: count0 },
                    { type: ENUM_LOG.FATAL, count: count1 },
                    { type: ENUM_LOG.ERROR, count: count2 },
                    { type: ENUM_LOG.WARN, count: count3 },
                    { type: ENUM_LOG.INFO, count: count4 },
                    { type: ENUM_LOG.DEBUG, count: count5 },
                    { type: ENUM_LOG.TRACE, count: count6 },
                    { type: ENUM_LOG.ALL, count: count7 },
                ],
            };
            list.push(joined);
        }
        return { list };
    }

    @Post("/delete")
    @UseGuards(UserGuard)
    async deleteAccess(@Body("dto") dto: deleteAccessDto, @Body("UserDTO") UserDTO: UserDTO): Promise<deleteAccessRes> {
        await this.LogAnalysisDao.delete(dto.entityId);
        return null;
    }
}
