import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question';
import { Answer } from './answer';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column()
    email: string;

    @IsNotEmpty()
    @Column()
    passwordHash: string;

    @IsNotEmpty()
    @Column()
    salt: string;

    @IsNotEmpty()
    @Column()
    name: string;

    @OneToMany(type => Question, question => question.user)
    questions: Question[];

    @OneToMany(type => Answer, answer => answer.user)
    answers: Answer[];
}
