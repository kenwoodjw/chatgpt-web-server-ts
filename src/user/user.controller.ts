
import {Body, Controller, Post, Req} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserLoginDto} from "./dto/user.dto";
import { Response } from "../interface/response.interface"
import {AuthService} from "../base/auth.service";

@Controller('user')
export class UserController {
	constructor(private userService: UserService,private authService:AuthService) {
	}

	@Post("/login")
	async login(@Body() userDto: UserLoginDto): Promise<Response> {
		const user = await this.userService.findUser(userDto);
		if (user) {

			let toekn = await this.authService.generateToken({
				email: userDto.email
			})

			const resData = {
				data: { token : toekn},
				message: "登录成功",
				status: "Success"
			}
			return Promise.resolve(resData)
		} else {
			const resData = {
				data: {},
				message: "用户名或密码错误",
				status: "Fail"
			}
			return Promise.resolve(resData)
		}


	}

}
