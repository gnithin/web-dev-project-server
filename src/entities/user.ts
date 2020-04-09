import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { Answer } from './answer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    @Column()
    email: string;

    @IsNotEmpty()
    @Column()
    name: string;

    @Column()
    passwordHash: string;

    @OneToMany(type => Question, question => question.user)
    questions: Question[];

    @OneToMany(type => Answer, answer => answer.user)
    answers: Answer[];

    @Column({default: false})
    isAdmin: boolean;
}
