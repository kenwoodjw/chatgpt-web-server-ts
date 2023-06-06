import { Module } from '@nestjs/common';
import {UserModule} from "../user/user.module";
import {StatController} from "./stat.controller";
import {StatService} from "./stat.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {UserStat} from "../entity/userStat.entity";

@Module({
	imports:[TypeOrmModule.forFeature([UserStat]),UserModule],
	controllers: [StatController],
	providers: [StatService],
	exports:[StatService]
})
export class StatModule {}