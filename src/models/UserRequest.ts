import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserRequest {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Length(5)
    password: string;
}
