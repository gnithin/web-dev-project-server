import { AnswerReputationPointRepository } from '../repositories/answerReputationPointRepository';
import { AnswerReputationPoint } from '../entities/answerReputationPoint';
import { User } from 'src/entities/user';
import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection, getManager } from 'typeorm';
import { Answer } from '../entities/answer';
import { QuestionService } from './questionService';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;
    private answerReputationPointRepository: AnswerReputationPointRepository;
    private questionService: QuestionService;


    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
        this.answerReputationPointRepository = getConnection()
            .getCustomRepository(AnswerReputationPointRepository);
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
        let point;
        point = await this.answerReputationPointRepository.findOne({
            where: { srcUser: { id: srcUser.id }, targetAnswer: { id: aid } }
        })
        if (!point) {
            point = new AnswerReputationPoint();
        }
        point.score = score;
        point.srcUser = srcUser;
        try {
            point.targetAnswer = await this.getAnswerById(aid);
            await this.answerReputationPointRepository.save(point);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public async deleteReputationVote(aid: number, srcUserId: number) {
        await getManager()
            .createQueryBuilder()
            .delete()
            .from(AnswerReputationPoint)
            .where('targetAnswer = :aid', { aid })
            .andWhere('srcUser = :uid', { uid: srcUserId })
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

