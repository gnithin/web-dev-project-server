import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection } from 'typeorm';
import { Answer } from '../entities/answer';
import { QuestionService } from './questionService';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;
    private questionService: QuestionService;


    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
        this.questionService = QuestionService.getInstance();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AnswerService();
        }
        return this.instance;
    }

    public async createAnswerForQuestion(answer: Answer, qid: number): Promise<Answer> {
        answer.question = await this.questionService.getQuestionById(qid);
        return await this.answerRepository.save(answer);
    }

    public async updateAnswerForId(aid: number, updatedAnswer: Answer): Promise<Answer> {
        let answer = await this.answerRepository.findOneOrFail(aid);
        updatedAnswer.user = answer.user;
        updatedAnswer.id = answer.id;
        return await this.answerRepository.save(updatedAnswer);
    }

    public async deleteAnswerForId(aid: number) {
        await this.answerRepository.delete(aid);
    }
}

