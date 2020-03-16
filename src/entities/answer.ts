import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { User } from './user';

@Entity({name: 'answers'})
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    answer: string;

    @ManyToOne(type => Question, question => question.answers)
    question: Question;

    @ManyToOne(type => User, user => user.id)
    user: User
}