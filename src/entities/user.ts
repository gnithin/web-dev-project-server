import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Question} from './question';
import {Answer} from './answer';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Question, question => question.id)
    questions: Question[];

    @OneToMany(type => Answer, answer => answer.id)
    answers: Answer[];
}