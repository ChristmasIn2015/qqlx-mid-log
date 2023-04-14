import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LogController } from "src/log/controller.rest";
import { LogAnalysisController } from "src/analysis/controller.rest";
import { LogRpc } from "src/log/controller.rpc";
import { Log, LogSchema, LogDao } from "dao/log";
import { LogAnalysis, LogAnalysisSchema, LogAnalysisDao } from "dao/analysis";

import { UserRemote } from "remote/user";

@Module({
    imports: [
        //
        MongooseModule.forRoot("mongodb://127.0.0.1:27017/qqlx"),
        MongooseModule.forFeature([
            { name: Log.name, schema: LogSchema },
            { name: LogAnalysis.name, schema: LogAnalysisSchema },
        ]),
    ],
    controllers: [LogController, LogRpc, LogAnalysisController],
    providers: [UserRemote, LogDao, LogAnalysisDao],
})
export class AppModule {}
