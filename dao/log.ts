import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Prop, Schema, SchemaFactory, InjectModel } from "@nestjs/mongoose";

import { ENUM_LOG, Log as QQLXLog } from "qqlx-core";
import { MongooseDao } from "qqlx-sdk";

@Schema()
export class Log implements QQLXLog {
    @Prop({
        default: ENUM_LOG.ERROR,
        enum: [
            //
            ENUM_LOG.OFF,
            ENUM_LOG.FATAL,
            ENUM_LOG.ERROR,
            ENUM_LOG.WARN,
            ENUM_LOG.INFO,
            ENUM_LOG.DEBUG,
            ENUM_LOG.TRACE,
            ENUM_LOG.ALL,
        ],
    })
    type: ENUM_LOG;

    @Prop({ default: "" })
    path: string;
    @Prop({ default: "" })
    chain: string;
    @Prop({ default: "" })
    json: string;

    @Prop({ required: true })
    _id: string;
    @Prop({ default: 0 })
    timeCreate: number;
    @Prop({ default: 0 })
    timeUpdate: number;
    @Prop({ default: "" })
    timeCreateString: string;
    @Prop({ default: "" })
    timeUpdateString: string;
}
export const LogSchema = SchemaFactory.createForClass(Log).set("versionKey", false);

@Injectable()
export class LogDao extends MongooseDao<Log> {
    constructor(@InjectModel(Log.name) private model: Model<Log>) {
        super(model);
    }
}
