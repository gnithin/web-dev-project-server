import { Question } from '../entities/question';
import { getConnection } from 'typeorm';
import { QuestionRepository } from '../repositories/questionRepository';
import { response } from 'express';

export class QuestionService {
    questionRepository: QuestionRepository;

    constructor() {
        this.questionRepository = getConnection().getCustomRepository(QuestionRepository);
    }

    public async getAllQuestions(): Promise<Question[]> {
        return await this.questionRepository.find({
            relations: ["user"]
        });
    }

    public async getQuestionById(qId: number): Promise<Question | undefined> {
        try {
            return await this.questionRepository.findOneOrFail(qId, {
                relations: ["user"]
            });
        } catch(e) {
            console.error(e);
        }
        
    }

    public async createNewQuestion(question: Question): Promise<Question> {
        console.log('Question - ', question);
        return this.questionRepository.save(question);
    }

    public async updateQuestion(question: Question): Promise<Question> {
        console.log('Updating - ', question);
        return this.questionRepository.save(question);
    }

    public async deleteQuestion(questionId: number): Promise<number> {
        console.log('Deleting - ', questionId);
        const res = await this.questionRepository.delete(questionId);
        return Number(res.affected);
    }
}