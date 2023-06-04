import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AppConfigService {

    constructor(private readonly configService: ConfigService) {
    }
    public getDatabase(): string {
        return this.configService.get<string>('DATABASE_NAME');
    }

    public getDatabaseHost(): string {
        console.log(this.configService.get<string>('DATABASE_HOST'));
        return this.configService.get<string>('DATABASE_HOST');
    }

    public getDatabasePort(): number {
        return this.configService.get<number>('DATABASE_PORT');
    }

    public getDatabaseUsername(): string {
        return this.configService.get<string>('DATABASE_USERNAME');
    }

    public getDatabasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD');
    }

    public getEmailServer(): string {
        return this.configService.get<string>('EMAIL_SERVER');
    }

    public getEmailServerPort(): number {
        return this.configService.get<number>('EMAIL_SERVER_PORT');
    }

    public getEmailUser(): string {
        return this.configService.get<string>('EMAIL_USER');
    }

    public getEmailPassword(): string {
        return this.configService.get<string>('EMAIL_PASSWORD');
    }

    public getServerPort(): number {
        return this.configService.get<number>('SERVER_PORT');
    }

    public getUserLimit(): number {
        return this.configService.get<number>('USER_LIMIT')|| 10;
    }

}