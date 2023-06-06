
import {Controller, Post, Req, Res} from '@nestjs/common';
import { Request,Response } from 'express';

@Controller()
export class ChatController {
    constructor() {
    }

    @Post("/chat-process")
    async chat(@Req() req: Request,@Res() res:Response) {

    }

}
