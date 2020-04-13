import { Question } from '../entities/question';
import { Answer } from '../entities/answer';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserPublicDetailsResponse {
    @Expose()
    id: number;

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
}
