import {Inject, Injectable, Logger} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {UserData} from "./interface/userData.interface"
import * as moment from 'moment';
import {formatDate} from "../util/common";
import {UserStat} from "../entity/userStat.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
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
        const userRepo = this.usersService.getUserRepo()
        const queryBuilder = userRepo.createQueryBuilder();
        const subqueryBuilder = queryBuilder
            .subQuery()
            .select('query_count')
            .from(UserStat, 'stat')
            .where('stat.email = :email', { email: '$email' })
            .andWhere('stat.squad_date = :squad_date', { squad_date: today })
            .getQuery();

        queryBuilder
            .select(['email', 'create_time', 'last_login_time'])
            .addSelect(`(${subqueryBuilder})`, 'query_count');

        const users = await queryBuilder.getRawMany();
        const res = []
        for (let i = 0; i < users.length; i++) {
            res.push({
                email:users[i].email,
                create_time:  users[i].create_time?moment(users[i].create_time).format('YYYY-MM-DD HH:mm:ss'): "",
                last_login_time: users[i].last_login_time?moment(users[i].create_time).format('YYYY-MM-DD HH:mm:ss'): "",
                usage:users[i].query_count?users[i].query_count:0,
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
        if(record===undefined) {
            return 0
        }else{
            return record.query_count
        }
    }


    public async updateQueryCountByEmail(email:string,count:number): Promise<void> {

    }
}
