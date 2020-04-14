import { QuestionReputationPointRepository } from './../repositories/questionReputationPointRepository';
import { QuestionReputationPoint } from './../entities/questionReputationPoint';
import { User } from './../entities/user';
import { AnswerRepository } from './../repositories/answerRepository';
import { Question } from '../entities/question';
import { getConnection, getManager } from 'typeorm';
import { QuestionRepository } from '../repositories/questionRepository';
import UserAuth from '../models/UserAuth';
import { UserService } from './userService';
import { Answer } from '../entities/answer';
import { AnswerReputationPointRepository } from '../repositories/answerReputationPointRepository';
import { CONTROLLER_CONSTANTS } from '../constants/controller';

export class QuestionService {
    private static instance: QuestionService;
    private questionRepository: QuestionRepository;
    private answerRepository: AnswerRepository;
    private answerReputationPointRepository: AnswerReputationPointRepository;
    private questionReputationPointRepository: QuestionReputationPointRepository;
    private userService: UserService;

    private constructor() {
        this.questionRepository = getConnection().getCustomRepository(QuestionRepository);
        this.userService = UserService.getInstance();
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
        this.questionReputationPointRepository = getConnection().getCustomRepository(QuestionReputationPointRepository);

        this.answerReputationPointRepository = getConnection()
            .getCustomRepository(AnswerReputationPointRepository);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new QuestionService();
        }
        return this.instance;
    }


    public async getAllQuestions(
        srcUserId?: number,
        limit=CONTROLLER_CONSTANTS.DEFAULT_LIMIT,
        offset=CONTROLLER_CONSTANTS.DEFAULT_OFFSET,
    ): Promise<Question[]> {
        try {
            const questions = await this.questionRepository.find({
                relations: ['user'],
                skip: offset,
                take: limit,
                order: {
                    id: "DESC", // TODO: This needs to be date-wise
                }
            });
            for (const question of questions) {
                question.totalReputation = await this.getQuestionReputation(question.id); 
                question.answersCount = await this.answerRepository.count({
                    where: { question: { id: question.id } }
                });
            }
            return questions;
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async getAnswersForQuestion(
        qId: number,
        srcUserId?: number,
        limit=CONTROLLER_CONSTANTS.DEFAULT_LIMIT,
        offset=CONTROLLER_CONSTANTS.DEFAULT_OFFSET,
    ): Promise<Answer[]> {
        const answers = await this.answerRepository.find({
            where: { question: { id: qId } },
            skip: offset,
            take: limit,
        });

        for (const answer of answers) {
            const rep = await this.getAnswerReputation(answer.id);
            answer.totalReputation = rep;
            const point = await this.answerReputationPointRepository.findOne({
                where: { srcUser: { id: srcUserId }, targetAnswer: { id: answer.id } }
            });
            answer.currentUserVote = point?.score;
        }

        return answers;
    }
    public async getQuestionById(qId: number, includeAnswers: boolean = true, srcUserId?: number): Promise<Question> {
        const relations: string[] = ['user'];

        try {
            const question = await this.questionRepository.findOneOrFail(qId, { relations });
            question.totalReputation = await this.getQuestionReputation(qId);
            const point = await this.questionReputationPointRepository.findOne({
                where: { srcUser: { id: srcUserId }, targetQuestion: { id: qId } }
            });
            question.currentUserVote = point?.score;
            if (includeAnswers) {
                question.answers = await this.getAnswersForQuestion(qId, srcUserId);
            }
            return question;
        } catch (e) {
            console.error(e);
            throw (e);
        }

    }

    public async createNewQuestion(question: Question, user: UserAuth): Promise<Question> {
        console.log('Question - ', question);
        try {
            question.user = await this.userService.findUserForId(user.id);
            question.createdTimestamp = new Date();
            return await this.questionRepository.save(question);
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async updateQuestion(qId: number, question: Question, user: UserAuth): Promise<Question> {
        let oldQuestion: Question | undefined = await this.questionRepository.findOne(qId, {
            relations: ['user']
        });
        if (oldQuestion === undefined) {
            throw new Error('Entity does not exist');
        }

        // Making sure OP is correct
        let oldUser = oldQuestion.user;
        if (!user.isAdmin && oldUser.id !== user.id) {
            throw new Error('Unauthorized user cannot modify the question!');
        }

        // TODO: Add edited by users list too (edit can happen from OP and admin)
        question.id = qId;
        question.user = oldUser;

        return await this.questionRepository.save(question);
    }

    public async deleteQuestion(questionId: number, user: UserAuth): Promise<number> {
        console.log('Deleting - ', questionId);
        if (!user.isAdmin) {
            let user = await getManager()
            .createQueryBuilder(Question, 'question')
            .leftJoin('question.user', 'user')
            .select('user.id', 'id')
            .whereInIds(questionId)
            .getRawOne();
                        
            if (user.id !== user.id) {
                throw new Error('Unauthorized user cannot delete the question!');
            }
        }

        const res = await this.questionRepository.delete(questionId);
        return Number(res.affected);
    }

    private async getAnswerReputation(answerId: number): Promise<number> {
        const reps = await getManager()
            .createQueryBuilder(Answer, 'answer')
            .leftJoin('answer.reputations', 'reputation')
            .select('SUM(reputation.score)', 'sum')
            .whereInIds(answerId)
            .getRawOne();

        if (!reps.sum) {
            return 0;
        }
        return reps.sum;
    }

    public async addReputationToQuestion(qId: number, score: number, srcUser: User) {
        let point: QuestionReputationPoint | undefined;
        point = await this.questionReputationPointRepository.findOne({
            where: { srcUser: { id: srcUser.id }, targetQuestion: { id: qId } }
        })
        if (!point) {
            point = new QuestionReputationPoint();
        }
        point.score = score;
        point.srcUser = srcUser;
        try {
            point.targetQuestion = await this.getQuestionById(qId);
            await this.questionReputationPointRepository.save(point);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    private async getQuestionReputation(questionId: number): Promise<number> {
        const reps = await getManager()
            .createQueryBuilder(Question, 'question')
            .leftJoin('question.reputations', 'reputation')
            .select('SUM(reputation.score)', 'sum')
            .whereInIds(questionId)
            .getRawOne();

        return reps.sum | 0;
    }

    public async deleteReputationVote(qId: number, srcUserId: number) {
        await getManager()
            .createQueryBuilder()
            .delete()
            .from(QuestionReputationPoint)
            .where('targetQuestion = :qId', { qId })
            .andWhere('srcUser = :uid', { uid: srcUserId })
            .execute();
    }

}
