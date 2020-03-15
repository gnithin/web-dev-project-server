import {Question} from '../entities/question';
import {getConnection} from 'typeorm';
import {QuestionRepository} from '../repositories/questionRepository';

export class QuestionService {
    public async getAllQuestions(): Promise<Question[]> {
        const questionRepository = getConnection().getCustomRepository(QuestionRepository);
        return await questionRepository.find();
    }
}