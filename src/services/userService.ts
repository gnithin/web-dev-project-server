import { AnswerReputationPoint } from './../entities/answerReputationPoint';
import { QuestionReputationPoint } from './../entities/questionReputationPoint';
import { UserRepository } from '../repositories/userRepository';
import { getConnection, getManager } from 'typeorm';
import { User } from '../entities/user';

const crypto = require('crypto');

export class UserService {
    private static instance: UserService;
    private userRepository: UserRepository;

    private constructor() {
        this.userRepository = getConnection().getCustomRepository(UserRepository);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }
        return this.instance;
    }

    public async registerUser(user: User): Promise<User> {
        user.createdTimestamp = new Date();
        return await this.userRepository.save(user);
    }

    public async findUserForEmail(email: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            email
        })
    }

    public async findUserForId(id: number): Promise<User> {
        return await this.userRepository.findOneOrFail({
            id,
        });
    }

    public async findUserDetailsForId(id: number): Promise<User> {
        const user = await this.userRepository.findOneOrFail(id, {
            relations: ['questions', 'answers', 'answers.question']
        });
        user.totalReputation = await this.getReputation(id);
        return user;
    }

    public async getReputation(userId: number): Promise<number> {
        const questionRep = await this.getQuestionReputation(userId);
        const answerRep = await this.getAnswerReputation(userId);

        return questionRep + answerRep;
    }

    private async getQuestionReputation(userId: number): Promise<number> {
        const result = await getManager()
            .createQueryBuilder(QuestionReputationPoint, 'point')
            .innerJoin('point.targetQuestion', 'question')
            .innerJoin('question.user', 'user')
            .where('user.id = :id', { id: userId })
            .select('SUM(point.score)', 'sum')
            .getRawOne();


        return result.sum | 0;
    }

    private async getAnswerReputation(userId: number): Promise<number> {
        const result = await getManager()
            .createQueryBuilder(AnswerReputationPoint, 'point')
            .innerJoin('point.targetAnswer', 'answer')
            .innerJoin('answer.user', 'user')
            .where('user.id = :id', { id: userId })
            .select('SUM(point.score)', 'sum')
            .getRawOne();

        return result.sum | 0;
    }

    public async setAdmin(userId:number) {
        let userEntry = await this.userRepository.findOneOrFail(userId);
        if(userEntry.isAdmin) {
            // User is already an admin
            return;
        }
        userEntry.isAdmin = true;
        await this.userRepository.save(userEntry);
    }

    public async unsetAdmin(userId:number) {
        let userEntry = await this.userRepository.findOneOrFail(userId);
        if(!userEntry.isAdmin) {
            // User is already an admin
            return;
        }
        userEntry.isAdmin = false;
        await this.userRepository.save(userEntry);
    }
}
