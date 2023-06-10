import {Inject, Injectable, Logger} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {UserData} from "./interface/userData.interface"
import moment from 'moment';
import {formatDate} from "../util/common";
import {UserStat} from "../entity/userStat.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entity/user.entity";
@Injectable()
export class StatService {

    private readonly logger = new Logger(StatService.name);

    constructor(private readonly usersService: UserService,
    @InjectRepository(UserStat) private statRepository: Repository<UserStat>
    ) {
    };

    /**
     * 通过用户名和密码查找单个用户
     * @param userDto
     */
    public async fetchUserData(): Promise<UserData[]> {
        const today = Number.parseInt(formatDate(new Date()));
        const users = await this.usersService.findAllUser()
        const stats = await this.statRepository.find(
            {
                where:{squad_date:today},
                order:{ email: "ASC"}
            }
        )
        const res = []
        let stat_index = 0;
        let query_count =0
        for (let i = 0; i < users.length; i++) {
            //stat可能为空
            if(stats[stat_index] && users[i].email === stats[stat_index].email){
                query_count = stats[stat_index].query_count
            }else{
                query_count = 0
            }
            res.push({
                email:users[i].email,
                create_time:  users[i].create_time?moment(users[i].create_time).format('YYYY-MM-DD HH:mm:ss'): "",
                last_login_time: users[i].last_login_time?moment(users[i].last_login_time).format('YYYY-MM-DD HH:mm:ss'): "",
                usage:query_count,
                limit:10
            })
        }
        return res
    }

    /**
     * 查找提问次数
     * @param email
     */
    public async getQueryCount(email :string):Promise<number>{
        const today = Number.parseInt(formatDate(new Date()));
        const record = await this.statRepository.findOne(
            {
                where:{
                    email:email,
                    squad_date:today
                }
            })
        if(record === null) {
            return 0
        }else{
            return record.query_count
        }
    }


    public async updateQueryCountByEmail(email:string,count:number): Promise<void> {
        const today = Number.parseInt(formatDate(new Date()));
        const existingUser = await this.statRepository.findOne(
            {
                where:{
                    email:email,
                    squad_date:today
                }
            }
        );
        if (existingUser) {
            existingUser.query_count = count;
            await this.statRepository.update({squad_date:today,email:email},{query_count:count});
        } else {
            const us = new UserStat();
            us.squad_date = today;
            us.email = email;
            us.query_count = count;
            await this.statRepository.insert(us);
        }
    }
}
