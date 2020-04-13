import { QuestionReputationPoint } from './questionReputationPoint';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer';
import { User } from './user';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'text' })
    title: string;

    @IsNotEmpty()
    @Column({
        type: 'longtext'
    })
    description: string;

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToOne(type => User, user => user.questions)
    user: User;

    @OneToMany(type => QuestionReputationPoint, reputationPoint => reputationPoint.targetQuestion)
    reputations: QuestionReputationPoint[]

    totalReputation: number

    [key: string]: any;
}
