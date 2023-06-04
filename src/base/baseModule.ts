import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {EmailService} from "./email.service";
import {AuthService} from "./auth.service";

@Module({
	imports:[ConfigModule.forRoot()],
	controllers: [],
	providers: [EmailService,AuthService],
	exports:[EmailService,AuthService]
})
export class BaseModule {}