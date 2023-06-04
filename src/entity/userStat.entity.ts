import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';

@Entity({name:"users_stat"})
export class UserStat {

    @PrimaryColumn({ type: 'int' })
    squad_date: number;

    @PrimaryColumn({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: "int" })
    query_count: number;
}