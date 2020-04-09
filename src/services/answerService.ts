import { ReputationPointRepository } from './../repositories/reputationPointRepository';
import { ReputationPoint } from '../entities/reputationPoint';
import { User } from 'src/entities/user';
import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection, getManager } from 'typeorm';
import { Answer } from '../entities/answer';
import { QuestionService } from './questionService';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;
    private reputationPointRepository: ReputationPointRepository;
    private questionService: QuestionService;


    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
        this.reputationPointRepository = getConnection()
            .getCustomRepository(ReputationPointRepository);
        this.questionService = QuestionService.getInstance();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AnswerService();
        }
        return this.instance;
    }

    public async createAnswerForQuestion(answer: Answer, qid: number): Promise<Answer> {
        answer.question = await this.questionService.getQuestionById(qid, false);
        return await this.answerRepository.save(answer);
    }

    public async updateAnswerForId(aid: number, updatedAnswer: Answer): Promise<Answer> {
        await this.answerRepository.findOneOrFail(aid);
        updatedAnswer.id = aid;
        return await this.answerRepository.save(updatedAnswer);
    }

    public async deleteAnswerForId(aid: number) {
        await this.answerRepository.delete(aid);
    }

    public async addReputationToAnswer(aid: number, score: number, srcUser: User) {
        const point = new ReputationPoint();
        point.score = score;
        point.srcUser = srcUser;
        try {
            point.targetAnswer = await this.getAnswerById(aid);
            await this.reputationPointRepository.save(point);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public async deleteReputationVote(aid: number, srcUser: User) {
        await getManager()
        .createQueryBuilder()
        .delete()
        .from(ReputationPoint)
        .where('targetAnswer = :aid', {aid})
        .andWhere('srcUser = :uid', {uid: srcUser.id})
        .execute();
    }

    private async getAnswerById(aid: number): Promise<Answer> {
        try {
            return await this.answerRepository.findOneOrFail(aid);
        } catch (e) {
            console.error(e);
            throw (e)
        }
    }
}

