import { Question } from './question';
import { User } from './user';
import { IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity({ name: 'question_reputation_points' })
@Unique(['srcUser', 'targetQuestion'])
export class QuestionReputationPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ type: 'integer' })
    score: number;

    @ManyToOne(() => Question, question => question.reputations, {
        onDelete: 'CASCADE'
    })
    
    @JoinColumn({name: 'target_question'})
    targetQuestion: Question;

    @ManyToOne(() => User, user => user.givenReputations)
    @JoinColumn({name: 'src_user'})
    srcUser: User;


}