import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponse {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    isAdmin: boolean;
}
