import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class RequestMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        console.log('Request URL:', req.url);
        console.log('Request Method:', req.method);
        console.log('Request Query Params:', req.query);
        console.log('Request Body:', req.body);
        next();
    }
}
