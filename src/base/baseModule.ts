import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {EmailService} from "./email.service";
import {AuthService} from "./auth.service";
import {BaseController} from "./base.controller";

@Module({
	imports:[ConfigModule.forRoot()],
	controllers: [BaseController],
	providers: [EmailService,AuthService],
	exports:[EmailService,AuthService]
})
export class BaseModule {}