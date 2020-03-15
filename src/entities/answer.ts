import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'answers'})
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    answer: string;
}