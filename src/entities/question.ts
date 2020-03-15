import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'questions'})
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    question: string;
}