import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { User } from './user';

@Entity({name: 'answers'})
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'longtext'})
    answer: string;

    @ManyToOne(type => Question, question => question.answers, {
        onDelete: 'CASCADE'
    })
    question: Question;

    @ManyToOne(type => User, user => user.answers)
    user: User
}
