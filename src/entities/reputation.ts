import { Answer } from './answer';
import { Question } from './question';
import { User } from './user';
import { IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, ManyToMany, OneToOne } from 'typeorm';

@Entity({ name: 'reputation_points' })
export class ReputationPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'integer' })
    score: number;

    @ManyToOne(type => Answer, answer => answer.reputations)
    @JoinColumn({name: 'target_answer'})
    targetAnswer: Answer;

    @ManyToOne(type => User, user => user.givenReputations)
    @JoinColumn({name: 'src_user'})
    srcUser: User;


}