import { Controller, Get, Post, Body, Patch, SetMetadata, UseGuards } from "@nestjs/common";

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
        await this.LogAnalysisDao.create(dto);
        return null;
    }

    @Post("/get")
    @UseGuards(UserGuard)
    async getLogAnalysis(@Body("dto") dto: getLogAnalysisDto, @Body("UserDTO") UserDTO: UserDTO): Promise<getLogAnalysisRes> {
        const analysis = await this.LogAnalysisDao.query({});

        const list: LogAnalysisJoined[] = [];
        for (const ana of analysis) {
            const count0 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.OFF });
            const count1 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.FATAL });
            const count2 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.ERROR });
            const count3 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.WARN });
            const count4 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.INFO });
            const count5 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.DEBUG });
            const count6 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.TRACE });
            const count7 = await this.LogDao.count({ path: ana.path, type: ENUM_LOG.ALL });
            const joined: LogAnalysisJoined = {
                ...ana,
                classes: [
                    { type: ENUM_LOG.OFF, count: count0 },
                    { type: ENUM_LOG.OFF, count: count1 },
                    { type: ENUM_LOG.OFF, count: count2 },
                    { type: ENUM_LOG.OFF, count: count3 },
                    { type: ENUM_LOG.OFF, count: count4 },
                    { type: ENUM_LOG.OFF, count: count5 },
                    { type: ENUM_LOG.OFF, count: count6 },
                    { type: ENUM_LOG.OFF, count: count7 },
                ],
            };
            list.push(joined);
        }
        return { list };
    }

    @Patch()
    @UseGuards(UserGuard)
    async deleteAccess(@Body("dto") dto: deleteAccessDto, @Body("UserDTO") UserDTO: UserDTO): Promise<deleteAccessRes> {
        await this.LogAnalysisDao.delete(dto.entityId);
        return null;
    }
}
