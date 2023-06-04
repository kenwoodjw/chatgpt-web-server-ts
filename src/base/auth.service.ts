import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';

const secret = 'Qwe123!@#';

export interface Payload {
    email: string;
}

@Injectable()
export class AuthService {
    async generateToken(payload: Payload): Promise<string> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(payload, secret, { expiresIn: '12h' }, (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            });
        });
    }

    async verifyToken(token: string): Promise<Payload> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, secret, (error, decoded) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(decoded as Payload);
                }
            });
        });
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
