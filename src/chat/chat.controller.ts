
import {Controller, Post, Req, Res, Sse} from '@nestjs/common';
import { Request,Response } from 'express';
import {ChatService} from "./chat.service";
import {Observable} from "rxjs";

@Controller()
export class ChatController {
    constructor(private readonly chatService:ChatService) {
    }

    @Post("/chat-process")
    async chat(@Req() req: Request,@Res() res:Response) {
        await this.chatService.send(req,res);
    }


    /*@Sse
    async chat_stream(): Observable<> {

    }*/



}
