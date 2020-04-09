import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export class UserLoginRequest {
    @IsNotEmpty()
    @IsEmail()
    @Expose()
    email: string;

    @IsNotEmpty()
    @Expose()
    password: string;
}
