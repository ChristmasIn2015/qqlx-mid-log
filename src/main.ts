import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

import { PORT_REST_LOG, HOST_MID_LOG, PORT_MID_LOG } from "qqlx-sdk";

import { GlobalExceptionFilter } from "global/exception.filter";
import { GlobalResponseInterceptor } from "global/response.interceptor";

async function bootstrap() {
    // 创建基于 TCP 协议的微服务
    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: { host: HOST_MID_LOG, port: PORT_MID_LOG },
    });
    await microservice.listen();

    // 启动 RESTful API
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new GlobalResponseInterceptor());
    await app.listen(PORT_REST_LOG);
}
bootstrap();
