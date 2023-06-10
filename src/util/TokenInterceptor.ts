import { Injectable, NestMiddleware } from '@nestjs/common';
import {AuthService} from "../base/auth.service";
import { Request,Response } from 'express';

@Injectable()
export class TokenInterceptor implements NestMiddleware {

    constructor(private authService:AuthService) {
    }

    private readonly publicPaths = [
        '/user/login',
        '/user/new',
        '/service/verifyToken',
        '/service/sendEmailCode',
        '/logger/level',
    ];

    async use(req: Request, res: Response, next: () => void) {
        const toPath = req.originalUrl;
        if (!this.publicPaths.some((path) => toPath.startsWith(path))) {
            const loginToken = req.header('LoginToken');

            try {
                if (!loginToken) {
                    throw new Error('Error: 无访问权限 | No access rights');
                }
                const userInfo = await this.authService.verifyToken(loginToken);
                req['userInfo'] = { email: userInfo.email };

                //todo 后续完善, 目前只有admin用户才能访问
                if(toPath === "/stat/userdata" && userInfo.email !== "admin@qq.com"){
                    throw new Error('Error: 无访问权限 | No access rights');
                }
                next();
            } catch (error) {
                res.send({
                    status: 'Unauthorized',
                    message: error.message ?? 'Please authenticate.',
                    data: null,
                });
            }
        } else {
            next();
        }
    }
}
