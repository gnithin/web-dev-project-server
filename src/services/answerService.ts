import { AnswerRepository } from '../repositories/answerRepository';
import { getConnection } from 'typeorm';
import { Answer } from '../entities/answer';
import { QuestionService } from './questionService';
import UserAuth from '../models/UserAuth';
import { UserService } from './userService';

export class AnswerService {
    private static instance: AnswerService;
    private answerRepository: AnswerRepository;
    private questionService: QuestionService;
    private userService: UserService;


    private constructor() {
        this.answerRepository = getConnection().getCustomRepository(AnswerRepository);
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
        answer.question = await this.questionService.getQuestionById(qid, false);
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
}

