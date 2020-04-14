import { AnswerReputationPoint } from './answerReputationPoint';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from './question';
import { User } from './user';
import { IsNotEmpty } from 'class-validator';

@Entity({name: 'answers'})
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({type: 'longtext'})
    answer: string;

    @ManyToOne(type => Question, question => question.answers, {
        onDelete: 'CASCADE'
    })
    question: Question;

    @ManyToOne(type => User, user => user.answers)
    user: User

    @OneToMany(type => AnswerReputationPoint, reputationPoint => reputationPoint.targetAnswer)
    reputations: AnswerReputationPoint[]

    totalReputation: number

    @Column(
        {
            // NOTE: This is for clean migration. Not ideal, but works
            nullable: true
        }
    )
    createdTimestamp: Date;

    [key: string]: any;
}
