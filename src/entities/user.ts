import { AnswerReputationPoint } from './answerReputationPoint';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Question } from './question';
import { Answer } from './answer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {Utils} from '../common/utils';


@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    email: string;

    @IsNotEmpty()
    @Column()
    name: string;

    @Column()
    passwordHash: string;

    @OneToMany(type => Question, question => question.user)
    questions: Question[];

    @OneToMany(type => Answer, answer => answer.user)
    answers: Answer[];

    @OneToMany(type => AnswerReputationPoint, reputationPoint => reputationPoint.srcUser)
    @JoinColumn({name: 'given_reputations'})
    givenReputations: AnswerReputationPoint[];

    @Column({default: false})
    isAdmin: boolean;

    toJSON() {
        return Utils.createObjWithoutKeys(this, ["passwordHash"]);
    }
}
