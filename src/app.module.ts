import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LogRpc } from "src/log/controller.rpc";
import { Log, LogSchema, LogDao } from "dao/log";

@Module({
    imports: [
        //
        MongooseModule.forRoot("mongodb://127.0.0.1:27017/qqlx"),
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    ],
    controllers: [LogRpc],
    providers: [LogDao],
})
export class AppModule {}
