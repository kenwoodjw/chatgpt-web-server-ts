
import {Controller, Post, Req, Res, Sse} from '@nestjs/common';
import { Request,Response } from 'express';
import {UserService} from "../user/user.service";
import {StatService} from "../stat/stat.service";
import {Observable} from "rxjs";
import {RequestProps} from "../interface/response.interface";
import {chatReplyProcess} from "./chatgpt";
import type {ChatMessage} from "chatgpt";

@Controller()
export class UserController {
    constructor(private userService: UserService,private statService: StatService) {
    }

    @Post("/chat-process")

    async chat(@Req() req: Request,@Res() res:Response) {
        res.setHeader('Content-type', 'application/octet-stream')
        try {
            const email = req["userInfo"].email
            //查询用户等级
            const user =  await this.userService.findUserByName(email)
            //查询用户今日查询次数
            let count =  await this.statService.getQueryCount(email)
            console.log(count)
            if(user.level === 1 && count >= 10){
                await Promise.reject({
                    message: "今日可提问次数已达上限,请明日再来思密达" ?? 'Failed',
                    data: null,
                    status: 'Failed',
                })
            }

            const {prompt, options = {}, systemMessage, temperature, top_p} = req.body as RequestProps
            let firstChunk = true
            await chatReplyProcess({
                message: prompt,
                lastContext: options,
                process: (chat: ChatMessage) => {
                    res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
                    firstChunk = false
                },
                systemMessage,
                temperature,
                top_p,
            })
            await this.statService.updateQueryCountByEmail(email,count+1);
        } catch (error) {
            res.write(JSON.stringify(error))
        } finally {
            res.end()
        }
    }

}
