import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export default class EditUserRequest {
    @IsEmail()
    @Expose()
    email: string;

    @IsNotEmpty()
    @Expose()
    name: string;
}
