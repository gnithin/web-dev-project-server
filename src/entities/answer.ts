import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Question} from './question';

@Entity({name: 'answers'})
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    answer: string;

    @ManyToOne(type => Question, question => question.answers)
    question: Question;
}