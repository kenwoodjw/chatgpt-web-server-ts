// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {AppConfigService} from "../config/app-config.service";


interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

interface VerificationCode {
    code: string;
    expiresAt: Date;
}

@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;
    private status = new Map<string, VerificationCode>();

    constructor(private readonly appConfigService: AppConfigService) {
        this.transporter = nodemailer.createTransport({
            host: appConfigService.getEmailServer(),
            port: appConfigService.getEmailServerPort(),
            secure: false, // 使用TLS加密
            auth: {
                user: appConfigService.getEmailUser(), // 请替换成您自己的电子邮件地址
                pass: appConfigService.getEmailPassword(), // 请替换成您自己的电子邮件密码或应用程序密码（如果使用的是Google帐户）
            },
        });
    }

    /**
     * 发送验证码
     * @param to    目标邮箱地址
     * @param code  验证码
     */
    async sendVerificationCode(to: string, code: string): Promise<void> {
        this.transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: to,
            subject: '机必替验证码',
            text: `您的验证码为：${code},有效期为10分钟.(*^_^*)`,
        }).then(() => {
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 设置验证码过期时间为当前时间+10分钟
            this.status.set(to, { code, expiresAt }); // 存储验证码和过期时间信息
            console.log(this.status);
        });
    }

    /**
     * 验证码校验
     * @param to  	目标邮箱地址
     * @param code  验证码
     */
    public checkEmailCode(to: string, code: string): boolean {
        const codeInfo = this.status.get(to);
        if (!codeInfo) {
            return false;
        }

        const nowDate = new Date(Date.now());
        if (nowDate <= codeInfo.expiresAt) {
            // 清除验证码
            this.status.delete(to);
            return true;
        }
        return false;
    }
}
