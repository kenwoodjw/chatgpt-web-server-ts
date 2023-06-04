import { Module } from '@nestjs/common';
import {User} from "../entity/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service"
import {TypeOrmModule} from "@nestjs/typeorm";
import {BaseModule} from "../base/baseModule";
import {UserStat} from "../entity/userStat.entity";

@Module({
	imports:[TypeOrmModule.forFeature([User]),BaseModule],
	controllers: [UserController],
	providers: [UserService],
	exports:[UserService]
})
export class UserModule {}