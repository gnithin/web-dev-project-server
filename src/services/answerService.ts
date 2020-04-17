import { AnswerReputationPointRepository } from '../repositories/answerReputationPointRepository';
import { AnswerReputationPoint } from '../entities/answerReputationPoint';
import { User } from 'src/entities/user';
import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection, getManager } from 'typeorm';
import { Answer } from '../entities/answer';
import { QuestionService } from './questionService';
import UserAuth from '../models/UserAuth';
import { UserService } from './userService';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;
    private answerReputationPointRepository: AnswerReputationPointRepository;
    private questionService: QuestionService;
    private userService: UserService;


    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
        this.answerReputationPointRepository = getConnection()
            .getCustomRepository(AnswerReputationPointRepository);
        this.questionService = QuestionService.getInstance();
        this.userService = UserService.getInstance();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AnswerService();
        }
        return this.instance;
    }

    public async createAnswerForQuestion(answer: Answer, qid: number, user: UserAuth): Promise<Answer> {
        answer.user = await this.userService.findUserForId(user.id);
        answer.createdTimestamp = new Date();
        answer.question = await this.questionService.getQuestionById(qid, false);
        const newAnswer = await this.answerRepository.save(answer);
        newAnswer.totalReputation = 0;
        newAnswer.currentUserVote = 0
        return await this.answerRepository.save(answer);
    }

    public async updateAnswerForId(aid: number, updatedAnswer: Answer, userReq: UserAuth): Promise<Answer> {
        let oldAnswer = await this.answerRepository.findOneOrFail(aid, {relations:["user"]});
        if (!userReq.isAdmin && oldAnswer.user.id !== userReq.id) {
            throw new Error('Unauthorized user cannot update the answer!');
        }

        // TODO: Store the edits and the user who edits them
        updatedAnswer.id = aid;
        updatedAnswer.user = oldAnswer.user;
        return await this.answerRepository.save(updatedAnswer);
    }

    public async deleteAnswerForId(aid: number, userReq: UserAuth) {
        if (!userReq.isAdmin) {
            let oldAnswer = await this.answerRepository.findOneOrFail(aid, {relations: ["user"]});
            if (oldAnswer.user.id !== userReq.id) {
                throw new Error("Unauthorized user cannot delete the answer!");
            }
        }

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

