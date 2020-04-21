import { Question } from '../entities/question';
import { Answer } from '../entities/answer';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDetailsResponse {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    questions: Question[];

    @Expose()
    answers: Answer[];

    @Expose()
    isAdmin: boolean;

    @Expose()
    totalReputation: number;

    @Expose()
    createdTimestamp: Date;
}
