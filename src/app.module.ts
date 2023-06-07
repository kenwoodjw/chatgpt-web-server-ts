import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppService} from './app.service';
import {AppConfigModule} from "./config/app-config.module";
import {AppConfigService} from "./config/app-config.service";
import {BaseModule} from "./base/base.module";
import {RequestMiddleware} from "./util/RequestMiddleware";
import {ChatModule} from './chat/chat.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "./user/user.module";
import {User} from "./entity/user.entity";
import {StatModule} from "./stat/stat.module";
import {UserStat} from "./entity/userStat.entity";
import {TokenInterceptor} from "./util/TokenInterceptor";

@Module({
    imports: [
        AppConfigModule,
        BaseModule,  //最先初始化, 邮件服务
        TypeOrmModule.forRootAsync({
            useFactory: (configService: AppConfigService) => ({
                type: 'mysql',
                host: configService.getDatabaseHost(),
                port: configService.getDatabasePort(),
                username: configService.getDatabaseUsername(),
                password: configService.getDatabasePassword(),
                database: configService.getDatabase(),
                //entities: [__dirname + '/**/*.entity{.ts}'],
                entities: [User, UserStat],
                //synchronize: true,
            }),
            inject: [AppConfigService],
        }),
        UserModule,
        StatModule,
        ChatModule,
    ],
    //controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestMiddleware).forRoutes('*');
        consumer.apply(TokenInterceptor).forRoutes('*'); // 绑定到所有路由上
    }


}
