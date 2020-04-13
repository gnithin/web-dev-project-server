import { Answer } from './answer';
import { User } from './user';
import { IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity({ name: 'reputation_points' })
@Unique(['srcUser', 'targetAnswer'])
export class AnswerReputationPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'integer' })
    score: number;

    @ManyToOne(() => Answer, answer => answer.reputations, {
        onDelete: 'CASCADE'
    })
    
    @JoinColumn({name: 'target_answer'})
    targetAnswer: Answer;

    @ManyToOne(() => User, user => user.givenReputations)
    @JoinColumn({name: 'src_user'})
    srcUser: User;

}