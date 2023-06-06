
import {Controller, Post, Req, Res} from '@nestjs/common';
import { Request,Response } from 'express';
import {ChatService} from "./chat.service";

@Controller()
export class ChatController {
    constructor(private readonly chatService:ChatService) {
    }

    @Post("/chat-process")
    async chat(@Req() req: Request,@Res() res:Response) {
        this.chatService.send(req,res);
    }

}
