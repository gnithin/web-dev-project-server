import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Answer} from './answer';

@Entity({name: 'questions'})
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    question: string;

    @OneToMany(type => Answer, answer => answer.id)
    answers: Answer[]
}