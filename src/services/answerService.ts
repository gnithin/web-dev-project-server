import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection } from 'typeorm';
import { Answer } from '../entities/answer';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;

    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AnswerService();
        }
        return this.instance;
    }

    public async createAnswerForQuestion(answer: Answer, qid: number): Promise<Answer> {
        // TODO: Logic
    }

    public async updateAnswerForId(aid: number, answer: Answer): Promise<Answer> {
        // TODO: Logic
    }

    public async deleteAnswerForId(aid: number) {
        // TODO: Logic
    }
}

