import {Controller, Get, Logger, Post, Req, Res} from '@nestjs/common';
import {EmailService} from "./email.service";
import {Response} from "../interface/response.interface";
import {Request} from "express";
import {AuthService} from "./auth.service";

@Controller("service")
export class BaseController {
    constructor(private emailService: EmailService,private authService: AuthService) {}
    private readonly logger = new Logger(BaseController.name);

    @Post("/sendEmailCode")
    public async sendEmailCode(@Req() req: Request): Promise<Response> {
        const { email } = req.body;
        const code = generateVerificationCode();
        try {
            await this.emailService.sendVerificationCode(email, code);
            return Promise.resolve({
                data: "",
                message: "验证码已发送",
                status: "Success"
            })
        } catch (error) {
            this.logger.error(error)
            return Promise.resolve({ status: 'Fail', message: error.message, data: null })
        }
    }

    @Post("/verifyToken")
    public async verifyToken(@Req() req: Request): Promise<Response>{
        const data = req.body;
        const loginToken = data.token
        try{
            if (!loginToken)
                throw new Error('Invalid Token')
            const obj =  await this.authService.verifyToken(loginToken)
            console.log("user:"+obj.email +" 通过token验证")
            return Promise.resolve({
                data: "",
                message: "",
                status: "Success"
            })
        }catch (error){
            return Promise.resolve({ status: 'Fail', message: error.message, data: null })
        }
    };


}

function generateVerificationCode(): string {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
}