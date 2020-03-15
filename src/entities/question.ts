import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Answer} from './answer';
import {User} from './user';

@Entity({name: 'questions'})
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    question: string;

    @OneToMany(type => Answer, answer => answer.id)
    answers: Answer[];

    @ManyToOne(type => User, user => user.id)
    user: User;
}