import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';

@Entity({name:"users"})
export class User {

	@PrimaryColumn({ type: 'varchar', length: 50 })
	email: string;

	@Column({ length: 250 })
	password: string;

	@Column({ type: 'datetime', nullable: false })
	create_time: Date;

	@Column({ type: 'datetime', nullable: false })
	last_login_time: Date;

	@Column({ default: 1 })
	valid: number;

	@Column({ default: 1 })
	level: number;
}