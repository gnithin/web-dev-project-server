import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class UserAuth {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    isAdmin: boolean;
}
