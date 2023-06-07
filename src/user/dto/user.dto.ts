import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class UserRegisterDto{
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    repw: string;

    @IsNotEmpty()
    emailCode:string;
}