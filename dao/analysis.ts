import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Prop, Schema, SchemaFactory, InjectModel } from "@nestjs/mongoose";

import { ENUM_LOG, LogAnalysis as _ } from "qqlx-core";
import { MongooseDao } from "qqlx-sdk";

@Schema()
export class LogAnalysis implements _ {
    @Prop({ default: "" })
    title: string;
    @Prop({ default: "" })
    desc: string;
    @Prop({ default: "" })
    path: string;

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
export const LogAnalysisSchema = SchemaFactory.createForClass(LogAnalysis).set("versionKey", false);

@Injectable()
export class LogAnalysisDao extends MongooseDao<LogAnalysis> {
    constructor(@InjectModel(LogAnalysis.name) private model: Model<LogAnalysis>) {
        super(model);
    }
}
