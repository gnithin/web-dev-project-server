import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer';
import { User } from './user';

@Entity({ name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    title: string;

    @Column({
        type: 'longtext',
        nullable: true
    })
    description: string;

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToOne(type => User, user => user.questions, {
        onDelete: 'CASCADE'
    })
    user: User;
}
