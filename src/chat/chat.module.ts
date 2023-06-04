import { Module } from '@nestjs/common';
import {ChatController} from "./chat.controller";
import {StatModule} from "../stat/stat.module";
import {UserModule} from "../user/user.module";

@Module({
    imports:[UserModule,StatModule],
    controllers:[ChatController],
    providers:[]
})
export class ChatModule {}
