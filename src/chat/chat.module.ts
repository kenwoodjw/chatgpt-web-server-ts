import { Module } from '@nestjs/common';
import {ChatController} from "./chat.controller";
import {StatModule} from "../stat/stat.module";
import {UserModule} from "../user/user.module";
import {ChatService} from "./chat.service";

@Module({
    imports:[UserModule,StatModule],
    controllers:[ChatController],
    providers:[ChatService]
})
export class ChatModule {}
