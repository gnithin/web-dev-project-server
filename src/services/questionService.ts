import { Question } from '../entities/question';
import { getConnection } from 'typeorm';
import { QuestionRepository } from '../repositories/questionRepository';
import UserAuth from '../models/UserAuth';
import { UserService } from './userService';

export class QuestionService {
    private static instance: QuestionService;
    private questionRepository: QuestionRepository;
    private userService: UserService;

    private constructor() {
        this.questionRepository = getConnection().getCustomRepository(QuestionRepository);
        this.userService = UserService.getInstance();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new QuestionService();
        }
        return this.instance;
    }


    public async getAllQuestions(): Promise<Question[]> {
        try {
            return await this.questionRepository.find({
                relations: ['user']
            });
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async getQuestionById(qId: number, includeAnswers: boolean = true): Promise<Question> {
        let relations: Array<string> = ['user'];
        if (includeAnswers) {
            relations.push('answers')
        }

        try {
            return await this.questionRepository.findOneOrFail(qId, {
                relations: relations
            });
        } catch (e) {
            console.error(e);
            throw (e);
        }

    }

    public async createNewQuestion(question: Question, user: UserAuth): Promise<Question> {
        console.log('Question - ', question);
        try {
            question.user = await this.userService.findUserForId(user.id);
            return await this.questionRepository.save(question);
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async updateQuestion(qId: number, question: Question, user: UserAuth): Promise<Question> {
        console.log('Updating - ', qId);
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
            let question: Question = await this.questionRepository.findOneOrFail(
                {id: questionId},
                {relations: ['user']}
            );

            if (user.id !== question.user.id) {
                throw new Error('Unauthorized user cannot delete the question!');
            }
        }

        const res = await this.questionRepository.delete(questionId);
        return Number(res.affected);
    }
}
