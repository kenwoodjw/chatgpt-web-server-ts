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
        if (!this.publicPaths.some((path) => req.path.startsWith(path))) {
            const loginToken = req.header('LoginToken');
            if (!loginToken) {
                throw new Error('Error: 无访问权限 | No access rights');
            }
            try {
                const userInfo = await this.authService.verifyToken(loginToken);
                req['userInfo'] = { email: userInfo.email };
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
